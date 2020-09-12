/**
 *      Kevinwkz - 2020/08/06
 */

const { Event } = require('..');
const { MessageEmbed } = require('discord.js');

var fetched;

class MemberAddEvent extends Event {
    constructor() {
        super({
            event: 'guildMemberAdd',
            callback: async (Bot, member) => {

                if (member.user.bot) return;

                await Bot.server.request('POST', `users/${member.id}`);

                if (!fetched) {
                    await member.guild.fetch();
                    await member.guild.members.fetch();
                    fetched = true;
                }

                const guild = member.guild;
                
                const id = (await Bot.server.request('GET', 'settings')).welcomeChannel;
                const mainChannel = guild.channels.cache.get(id);

                if (mainChannel) {
                    const count = guild.members.cache.filter(m => !m.bot).size;

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

                const welcomeRoles = (await Bot.server.request('GET', 'settings')).welcomeRoles || [];
                welcomeRoles.length && member.roles.set(welcomeRoles).catch();
                
            }
        });
    }
}

module.exports = MemberAddEvent;