/**
 *      Kevinwkz - 2020/08/06
 */

const { Event } = require('..');

class UserLeft extends Event {
    constructor() {
        super({
            event: 'guildMemberRemove',
            callback: (Bot, member) => Bot.server.request('DELETE', `users/${member.id}`),
        });
    }
}

module.exports = UserLeft;