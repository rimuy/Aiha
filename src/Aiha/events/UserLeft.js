/**
 *      Kevinwkz - 2020/09/06
 */

const { Event, BaseEmbed, Status, Server, ZeroWidthSpace } = require('..');

class MemberRemoveEvent extends Event {
    constructor() {
        super({
            event: 'guildMemberRemove',
            callback: async (Bot, member) => {
                if (member.user.bot) return;

                Server.Database.request('DELETE', `users/${member.id}`);
                
                await Server.Database.request('GET', 'mudae')
                    .then(res => {
                        Object.keys(res).forEach(async key => 
                            await Server.Database.request('DELETE', `mudae/${key}/${member.id}`)
                        );
                    })
                    .catch(console.log);

                if (!Bot.fetched) {
                    await member.guild.fetch();
                    Bot.fetched = true;
                }

                await Status.update(member.guild);
            
                const id = (await Server.Database.request('GET', 'settings')).logChannel;
                const logChannel = member.guild.channels.cache.get(id);

                const highestRole = member.guild.roles.cache
                    .filter(r => r.hoist)
                    .sort((a, b) => b.position - a.position)
                    .first();
                
                const embed = new BaseEmbed()
                    .setTitle('Usuário saiu do servidor')
                    .addFields(
                        { name: 'Tag', value: member.user.tag, inline: true },
                        { name: 'ID', value: member.id, inline: true },
                    )
                    .setFooter(ZeroWidthSpace, member.user.displayAvatarURL({ dynamic: true }));

                logChannel.send({ content: highestRole ? `<@&${highestRole.id}>` : ZeroWidthSpace, embed })
                    .catch(console.log);

            }
        });
    }
}

module.exports = MemberRemoveEvent;