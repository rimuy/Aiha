/**
 *      Kevinwkz - 2020/09/06
 */

const { Internals, Monitors, Modules, Server } = require('..');
const { MessageEmbed } = require('discord.js');

class MemberAddEvent extends Internals.Event {
    constructor() {
        super({
            event: 'guildMemberAdd',
            callback: async member => {

                if (member.user.bot) return;

                await Server.Database.request('POST', `users/${member.id}`);

                const bot = member.instance;

                if (!bot.fetched) {
                    await member.guild.fetch();
                    await member.guild.members.fetch();
                    await member.guild.roles.fetch();
                    bot.fetched = true;
                }

                const guild = member.guild;

                await Monitors.MemberCounter.update(guild);
                const isMuted = !(await Monitors.MuteManager.get(member.id)).error;

                if (isMuted) {
                    
                    const MuteRole = Modules.MuteRole.get(guild);

                    if (MuteRole) {
                        await member.roles.add(MuteRole);
                        const logEmbed = new Internals.BaseEmbed()
                            .setTitle('Usuário entrou no servidor, porém permanece mutado.')
                            .addFields(
                                { name: 'Usuário', value: `<@${member.id}>`, inline: true },
                                { name: 'ID', value: member.id, inline: true },
                            );

                        Modules.Logs.run(guild, logEmbed);
                    }
                    
                } else {

                    const id = (await Server.Database.request('GET', 'settings')).welcomeChannel;
                    const mainChannel = guild.channels.cache.get(id);

                    if (mainChannel) {
                        const count = guild.members.cache.filter(m => !m.user.bot).size;

                        mainChannel.send(
                            new MessageEmbed()
                                .setColor(0xff0a68)
                                .setTitle('Nova pessoinha :O')
                                .setDescription(`Seja bem vindo (a) <@${member.id}>!`)
                                .setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true }))
                                .addFields([
                                    { name: 'Com você, temos', value: `${count} membros!` }
                                ])
                                .setImage('https://i.imgur.com/V3ixT7M.png')
                        );
                    }

                }

                const welcomeRoles = (await Server.Database.request('GET', 'settings')).welcomeRoles || [];
                welcomeRoles.length && member.roles.set(welcomeRoles).catch();
                
            }
        });
    }
}

module.exports = MemberAddEvent;