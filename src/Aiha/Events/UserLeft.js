/**
 *      Kevinwkz - 2020/09/06
 */

const { Internals, Monitors, Server, ZeroWidthSpace } = require('..');

class MemberRemoveEvent extends Internals.Event {
    constructor() {
        super({
            event: 'guildMemberRemove',
            callback: async member => {
                if (member.user.bot) return;

                Server.Database.request('DELETE', `users/${member.id}`);
                
                await Server.Database.request('GET', 'mudae')
                    .then(res => {
                        Object.keys(res).forEach(async key => 
                            await Server.Database.request('DELETE', `mudae/${key}/${member.id}`)
                        );
                    })
                    .catch(console.log);

                const bot = member.instance;

                if (!bot.fetched) {
                    await member.guild.fetch();
                    bot.fetched = true;
                }

                await Monitors.MemberCounter.update(member.guild);
            
                const id = (await Server.Database.request('GET', 'settings')).logChannel;
                const logChannel = member.guild.channels.cache.get(id);

                const highestRole = member.guild.roles.cache
                    .filter(r => r.hoist)
                    .sort((a, b) => b.position - a.position)
                    .first();
                
                const embed = new Internals.BaseEmbed()
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