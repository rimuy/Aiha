/**
 *      Kevinwkz - 2020/09/06
 */

const { Event, Server } = require('..');

class MemberRemoveEvent extends Event {
    constructor() {
        super({
            event: 'guildMemberRemove',
            callback: (Bot, member) => {
                if (member.user.bot) return;

                Server.Database.request('DELETE', `users/${member.id}`);
            }
        });
    }
}

module.exports = MemberRemoveEvent;