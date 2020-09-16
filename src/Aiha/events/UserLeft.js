/**
 *      Kevinwkz - 2020/09/06
 */

const { Event, Server, MudaeObserver } = require('..');
const mudae = new MudaeObserver();

class MemberRemoveEvent extends Event {
    constructor() {
        super({
            event: 'guildMemberRemove',
            callback: (Bot, member) => {
                if (member.user.bot) return;

                Server.Database.request('DELETE', `users/${member.id}`);
                
                ['claimMembers', 'rollMembers'].forEach(key => {
                    if (mudae[key] && mudae[key].has(member.id)) mudae[key].delete(member.id);
                });

            }
        });
    }
}

module.exports = MemberRemoveEvent;