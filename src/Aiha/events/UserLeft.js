/**
 *      Kevinwkz - 2020/08/06
 */

const { Event } = require('..');

class MemberRemoveEvent extends Event {
    constructor() {
        super({
            event: 'guildMemberRemove',
            callback: (Bot, member) => {
                if (member.user.bot) return;

                Bot.server.request('DELETE', `users/${member.id}`);
            }
        });
    }
}

module.exports = MemberRemoveEvent;