/**
 *      Kevinwkz - 2020/08/27
 */

const { Command } = require('../..');
const { MessageEmbed } = require('discord.js');

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

        msg.mentions.members.forEach(m => members.add(m));

        if (!members.size) {
            embed
              .setDescription(`⚠️ **Por favor, indique um membro válido.**`)
              .setColor(0xe3c51b);

            return msg.channel.send(embed);
        };

        const reason = args.slice(members.size).join(' ');
        
        await Promise.all(
            [...members].map(member => new Promise(async res => {

                if (member.kickable) 
                    await member.kick(reason || 'Nenhum motivo foi registrado.')
                        .then(member => kickedMembers.add(member.id))
                        .catch();
                
                res();
                
            }))
        );

        const MakeEmbed = () => {
            if (members.size < 2) {
        
                const member = [...members][0];
    
                if (kickedMembers.has(member.id)) {
                    embed
                      .setDescription(`✅ \`${member.user.tag}\` **foi expulso(a) com sucesso.**`)
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
                        `${kickedMembers.has(m.id) ? '✅' : '❌'} **${m.user.tag}**`).join('\n')
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