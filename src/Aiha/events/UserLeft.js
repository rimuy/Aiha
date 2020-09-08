/**
 *      Kevinwkz - 2020/08/06
 */

const { Event } = require('..');

class MemberRemoveEvent extends Event {
    constructor() {
        super({
            event: 'guildMemberRemove',
            callback: (Bot, member) => {
                console.log('b');
                Bot.server.request('DELETE', `users/${member.id}`);
            }
        });
    }
}

module.exports = MemberRemoveEvent;