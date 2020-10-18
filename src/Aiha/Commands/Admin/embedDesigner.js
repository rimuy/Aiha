/**
 *      Kevinwkz - 2020/10/18
 */

const { Internals } = require('../..');
const { MessageEmbed, MessageCollector } = require('discord.js');
const { inspect } = require('util');

class EmbedDesigner extends Internals.Command {
    constructor() {
        super('embedDesigner', {
            description: 'Embed Designer',
            usage: 'embedDesigner',
            aliases: ['design'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
            multiChannel: true,
        });
    }

    async run(msg) {
        
        const bot = msg.instance;

        const embed = new MessageEmbed()
            .setTitle('title')
            .setDescription('description')
            .setFooter('footer');

        const placeholder = { 
            content: `${bot.emojis.get('name', 'bot2Confirm')} Digite \`cancel\` para encerrar a edição.\n${Internals.Constants.ZeroWidthSpace}`,
            embed,
        };

        const embedMsg = await msg.target.send(placeholder);

        const time = 30000;
        const collector = new MessageCollector(msg.target, m => m.author.equals(msg.author), { time });
        const startedCollecting = Date.now();

        let changed;
        let lastMsg = msg;

        collector.on('collect', async m => {

            const mArgs = m.content.split(' ');
            const setter = embed[mArgs[0]];
            const value = mArgs.slice(1).join(' ');

            if (mArgs[0] === 'cancel') {
                lastMsg = m;
                return collector.stop();
            }

            if (setter !== null && typeof setter !== 'function') {
                embed[mArgs[0]] = typeof value  !== 'string' ? inspect(value) : value;
                await embedMsg.edit(placeholder);
                
                lastMsg = m;
                changed = true;
            }
             
            const timePassed = Date.now() - startedCollecting;
            timePassed >= time / 2 && collector.resetTimer({ time: time / 2 });
        });

        collector.on('end', () => {
            embedMsg.delete()
                .then(async () => {
                    await lastMsg.react(bot.emojis.get('name', 'bot2Success')).catch(() => false);
                    changed && await msg.target.send(embed);
                })
                .catch(console.log);
        });

    }
}

module.exports = EmbedDesigner;