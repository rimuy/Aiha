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
            '0': ':0_:',
            '1': ':1_:',
            '2': ':2_:',
            '3': ':3_:',
            '4': ':4_:',
            '5': ':5_:',
            '6': ':6_:',
            '7': ':7_:',
            '8': ':8_:',
            '9': ':9_:',
        };

        membersSize = (' ' + ZeroWidthSpace).repeat(64) + '00000'.slice(0, -(membersSize.toString()).length) + membersSize.toString();

        const topics = [
            '`Membros` ' + membersSize.split('').map(n => emojis[n] || '').join(''),
        ];

        channel.setTopic(`${topics.join('\n')}`);

        return 'OK';
    }
}

module.exports = GuildStatus;