const Server = require('../../../server');

class GuildStatus {
    static async update(guild, fetch) {
        const id = (await Server.Database.request('GET', 'settings')).welcomeChannel;
        if (!id || !id.length) throw 'ReferenceError: Welcome Channel is not defined';

        if (fetch) {
            await guild.fetch();
        }

        if (!guild.channels.cache.size) {
            return 'Error: Empty cache';
        }

        const channel = guild.channels.cache.get(id);
        let membersSize = guild.members.cache.filter(m => !m.user.bot).size; 

        const emojis = {
            '0': ':zero:',
            '1': ':one:',
            '2': ':two:',
            '3': ':three:',
            '4': ':four:',
            '5': ':five:',
            '6': ':six:',
            '7': ':seven:',
            '8': ':eight:',
            '9': ':nine:',
        };

        membersSize = '00000'.slice(0, -(membersSize.toString()).length) + membersSize.toString();

        const topics = [
            'Membros: ' + membersSize.split('').map(n => emojis[n] || '').join(''),
        ];

        channel.setTopic(`${topics.join('\n')}`);

        return 'OK';
    }
}

module.exports = GuildStatus;