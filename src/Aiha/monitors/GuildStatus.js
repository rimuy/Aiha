const Server = require('../../../server');
const { ZeroWidthSpace } = require('..');

class GuildStatus {
    static async update(guild, fetch) {
        const id = (await Server.Database.request('GET', 'settings')).welcomeChannel;
        if (!id || !id.length) throw 'ReferenceError: Welcome Channel is not defined';

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
            '0': guild.emojis.cache.get('0_'),
            '1': guild.emojis.cache.get('1_'),
            '2': guild.emojis.cache.get('2_'),
            '3': guild.emojis.cache.get('3_'),
            '4': guild.emojis.cache.get('4_'),
            '5': guild.emojis.cache.get('5_'),
            '6': guild.emojis.cache.get('6_'),
            '7': guild.emojis.cache.get('7_'),
            '8': guild.emojis.cache.get('8_'),
            '9': guild.emojis.cache.get('9_'),
        };

        membersSize = (' ' + ZeroWidthSpace).repeat(64) + '00000'.slice(0, -(membersSize.toString()).length) + membersSize.toString();

        const topics = [
            'Membros: ' + membersSize.split('').map(n => emojis[n] || '').join(''),
        ];

        channel.setTopic(`${topics.join('\n')}`);

        return 'OK';
    }
}

module.exports = GuildStatus;