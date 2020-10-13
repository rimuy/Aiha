const Server = require('../Server');
const { ZeroWidthSpace } = require('../src/Aiha');

class MemberCounter {
    static async update(guild, fetch) {
        const id = (await Server.Database.request('GET', 'settings')).welcomeChannel;
        if (!id || !id.length) throw 'ReferenceError: Welcome Channel is not defined';

        if (fetch) {
            await guild.fetch();
        }

        if (!guild.channels.cache.size) {
            throw 'Error: Empty cache';
        }

        const bot = guild.instance;
        const channel = guild.channels.cache.get(id);
        let membersSize = guild.members.cache.filter(m => !m.user.bot).size; 

        if (!channel) {
            throw 'ReferenceError: Channel is not defined';
        }

        const emojis = {
            '0': bot.emojis.get('name', '0_'),
            '1': bot.emojis.get('name', '1_'),
            '2': bot.emojis.get('name', '2_'),
            '3': bot.emojis.get('name', '3_'),
            '4': bot.emojis.get('name', '4_'),
            '5': bot.emojis.get('name', '5_'),
            '6': bot.emojis.get('name', '6_'),
            '7': bot.emojis.get('name', '7_'),
            '8': bot.emojis.get('name', '8_'),
            '9': bot.emojis.get('name', '9_'),
        };

        const counter = (' ' + ZeroWidthSpace).repeat(64) + '00000'.slice(0, -(membersSize.toString()).length) + membersSize.toString();

        const topics = [
            'Membros: ' + counter.split('').map(n => emojis[n] || '').join(''),
        ];

        channel.setTopic(`${topics.join('\n')}`);

        return membersSize;
    }
}

module.exports = MemberCounter;