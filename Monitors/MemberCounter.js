const Server = require('../Server');
const { ZeroWidthSpace } = require('../src/Aiha');

class MemberCounter {
    static async update(Bot, guild, fetch) {
        const id = (await Server.Database.request('GET', 'settings')).welcomeChannel;
        if (!id || !id.length) throw 'ReferenceError: Welcome Channel is not defined';

        if (!Bot) {
            throw 'ReferenceError: Bot is not defined';
        }

        if (fetch) {
            await guild.fetch();
        }

        if (!guild.channels.cache.size) {
            throw 'Error: Empty cache';
        }

        const channel = guild.channels.cache.get(id);
        let membersSize = guild.members.cache.filter(m => !m.user.bot).size; 

        if (!channel) {
            throw 'ReferenceError: Channel is not defined';
        }

        const emojis = {
            '0': Bot.emojis.get('0_'),
            '1': Bot.emojis.get('1_'),
            '2': Bot.emojis.get('2_'),
            '3': Bot.emojis.get('3_'),
            '4': Bot.emojis.get('4_'),
            '5': Bot.emojis.get('5_'),
            '6': Bot.emojis.get('6_'),
            '7': Bot.emojis.get('7_'),
            '8': Bot.emojis.get('8_'),
            '9': Bot.emojis.get('9_'),
        };

        membersSize = (' ' + ZeroWidthSpace).repeat(64) + '00000'.slice(0, -(membersSize.toString()).length) + membersSize.toString();

        const topics = [
            'Membros: ' + membersSize.split('').map(n => emojis[n] || '').join(''),
        ];

        channel.setTopic(`${topics.join('\n')}`);

        return 'OK';
    }
}

module.exports = MemberCounter;