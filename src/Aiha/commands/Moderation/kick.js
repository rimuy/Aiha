/**
 *      Kevinwkz - 2020/08/27
 */

const { Command } = require('../..');
const { MessageEmbed } = require('discord.js');
const Logs = require('../../lib/Logs');

class Kick extends Command {
    constructor() {
        super('kick', {
            description: 'Expulsa todos os membros citados.',
            usage: 'kick `<@membro>` `[motivo]`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['KICK_MEMBERS']
        });
    }

    async run(Bot, msg, args) {

        const members = new Set();
        const kickedMembers = new Set();
        const embed = new MessageEmbed().setColor(0x1ba4e3);

        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

        msg.mentions.members.forEach(m => members.add(m));

        if (!members.size) {
            embed
              .setDescription(`${exclamation} **Por favor, indique um membro válido.**`)
              .setColor(0xe3c51b);

            return msg.channel.send(embed);
        };

        const reason = args.slice(members.size).join(' ') || 'Nenhum motivo foi registrado.';
        
        await Promise.all(
            [...members].map(member => new Promise(async res => {

                if (member.kickable && !member.permissions.has(this.userPerms)) 
                    await member.kick(reason)
                        .then(member => {
                            kickedMembers.add(member.id);

                            const logEmbed = new BaseEmbed()
                                .setTitle('Membro Expulso')
                                .addFields(
                                    { name: 'Usuário', value: `<@${member.id}>`, inline: true },
                                    { name: 'Motivo', value: `\`${reason}\``, inline: true },
                                );

                            Logs(Bot, msg.channel, logEmbed);
                        })
                        .catch(() => {});
                
                res();
                
            }))
        );

        const MakeEmbed = () => {
            if (members.size < 2) {
        
                const member = [...members][0];
    
                if (kickedMembers.has(member.id)) {
                    embed
                      .setDescription(`${success} \`${member.user.tag}\` **foi expulso(a) com sucesso.**`)
                      .setColor(0x27db27);
                    
                    return;
                }

                embed
                  .setDescription(`:person_gesturing_no: **Não foi possivel realizar o kick do membro.**`)
                  .setColor(0xF44336);
    
            } else {
    
                if (kickedMembers.size) {
                    embed
                      .setTitle('Membros expulsos')
                      .setDescription([...members].map(m => 
                        `${kickedMembers.has(m.id) ? success : error} **${m.user.tag}**`).join('\n')
                      );

                    return;
                }

                embed
                  .setDescription(`:person_gesturing_no: **Não foi possivel realizar o kick de nenhum dos membros citados.**`)
                  .setColor(0xF44336);
                
            }
        }

        MakeEmbed();

        msg.channel.send(embed);
        
    }
}

module.exports = Kick;