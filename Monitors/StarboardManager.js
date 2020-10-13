const Server = require('../Server');
const BaseEmbed = require('../Internals/Structures/BaseEmbed');
const moment = require('moment-timezone');
const { Starboard, ZeroWidthSpace } = require('../Internals/Contants');

var bot;

function Message(msg, stars) 
{

    const visual = {
        '1': { emoji: '⭐', color: 0xffe187 },
        '5': { emoji: '🌟', color: 0xffdd75 },
        '10': { emoji: '💫', color: 0xffd659 },
        '20': { emoji: '✨', color: 0xffd042 },
    };

    const getObj = () => visual [
        Math.min(...Object.keys(visual).map(n => Number(n)).filter(k => k <= stars))
    ];

    const attachment = msg.attachments
        .filter(att => 
            ['png', 'PNG', 'jpg', 'jpeg', 'gif']
                .some(supported => att.proxyURL.endsWith('.' + supported))
        )
        .first();

    /* Video */
    msg.attachments.forEach(att => {
        if (['webm', 'mp4', 'mov'].some(e => att.proxyURL.endsWith('.' + e))) {
            msg.content += '' + att.proxyURL;
        }
    });

    const embed = new BaseEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
        .setDescription((msg.content || ZeroWidthSpace).slice(0, 2048))
        .setColor(getObj().color)
        .addField('Original', `[Clique para pular para a mensagem!](${msg.url})`)
        .setFooter(moment(msg.createdAt).format('HH:mm'))
        .setTimestamp(msg.createdAt);
        
    attachment && embed.setImage(attachment.proxyURL || '');

    return { 
        content: `${getObj().emoji} **${stars}** <#${msg.channel.id}> ID: ${msg.id}`, 
        embed,
    };
}

async function StarboardChannel() 
{
    const channelId = (await Server.Database.request('GET', 'settings')).starboardChannel || '';
    const channel = await bot.client.channels.fetch(channelId);

    if (!channel) throw new ReferenceError('StarboardChannel not found.');

    return channel;
}

class StarboardManager
{
    static async add(msg, stars) 
    {
        const stChannel = await StarboardChannel();

        const content = Message(msg, stars);
        await stChannel.send(content)
            .then(m => Server.Database.request('POST', 'starboard/' + msg.id, { 
                boardId: m.id, 
                channelId: msg.channel.id, 
                createdAt: new Date() 
            }))
            .catch(console.log);
    }

    static async check(msg) 
    {
        let count = 0;
        let force;

        const reaction = msg.reactions.cache.find(r => r.emoji.name === Starboard.EMOJI);
        const data = await Server.Database.request('GET', 'starboard/' + msg.id || '0');
        const stChannel = await StarboardChannel();
        const contentId = (msg.content.match(/ID: (\d+)/) || [])[1];

        if (contentId && msg.channel.id === stChannel.id) {
            return StarboardManager.delete(contentId);
        }

        if (reaction) {

            reaction.users.cache
                .forEach(user => {
                    const member = msg.guild.members.cache.get(user.id);
                    if (member.hasPermission('ADMINISTRATOR')) force = true;
    
                    count++;
                });
    
            if (count >= Starboard.MIN_REACTIONS || force) {
                
                if (data.error)
                    return StarboardManager.add(msg, 1);
    
                return StarboardManager.update(data, reaction.users.cache.size + 1);
            } else if (!data.error) {
                return StarboardManager.update(data, reaction.users.cache.size + 1);
            }

            return 'OK';
        }

        if (!data.error)
            return StarboardManager.delete(data.id);

    }

    static async update(data, stars) 
    {
        const channel = await bot.client.channels.fetch(data.channelId);
        const stChannel = await StarboardChannel();
        const msg = await channel.messages.fetch(data.id);
        const board = await stChannel.messages.fetch(data.boardId);

        return board.edit(Message(msg, stars));
    }

    static async delete(id) 
    {
        const data = await Server.Database.request('GET', 'starboard/' + id || '0');
        if (!data) throw new ReferenceError('Starboard not found.');

        const channel = await StarboardChannel();
        const board = await channel.messages.fetch(data.boardId).catch(() => false);

        return await Server.Database.request('DELETE', 'starboard/' + id)
            .then(() => board && board.delete())
            .catch();
    }

    static async fetch() 
    {
        const starboard = await Server.Database.request('GET', 'starboard');
        const stChannel = await StarboardChannel();

        starboard.forEach(async data => {
            const channel = await bot.client.channels.fetch(data.channelId);
            
            const board = await stChannel.messages.fetch(data.boardId);
            const msg = await channel.messages.fetch(data.id).catch(() => false);

            if (!board || !msg) {
                board && await board.delete();
                await Server.Database.request('DELETE', 'starboard/' + data.id);
            }

        });
    }

    static get Bot() {
        return bot;
    }

    static set Bot(obj) {
        bot = obj;
    }
}

module.exports = StarboardManager;