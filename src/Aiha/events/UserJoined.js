/**
 *      Kevinwkz - 2020/08/06
 */

const { Event } = require('..');
const { MessageEmbed } = require('discord.js');

class UserJoined extends Event {
    constructor() {
        super({
            event: 'guildMemberAdd',
            callback: async (Bot, member) => {
                Bot.server.request('POST', `users/${member.id}`);
                
                const mainChannel = member.guild.publicUpdatesChannel;

                if (mainChannel) {
                    const count = (await member.guild.members.fetch()).filter(m => !m.bot).size;

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
                
            },
        });
    }
}

module.exports = UserJoined;