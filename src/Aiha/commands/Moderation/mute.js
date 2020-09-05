/**
 *      Kevinwkz - 2020/08/27
 */

const { Command } = require('../..');
const { MessageEmbed } = require('discord.js');
const MuteRule = require('../../lib/MuteRole');

class Mute extends Command {
    constructor() {
        super('mute', {
            description: 'Silencia todos os membros citados.',
            usage: 'mute `<@membro>` `[motivo]`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_ROLES']
        });
    }

    async run(Bot, msg, args) {

        const embed = new MessageEmbed().setColor(0xe3c51b);
        const muteRole = await MuteRule(msg.guild);

        if (!muteRole) 
            return msg.channel.send(embed.setDescription('⚠️ **Não foi possível criar o cargo de mute.**'));

        embed.setColor(0x1ba4e3);

        const members = new Set();
        const mutedMembers = new Set();
        
        msg.mentions.members.forEach(m => !m.roles.cache.has(muteRole.id) && members.add(m));

        if (!members.size) {
            embed
              .setDescription(`⚠️ **Por favor, indique um membro válido.**`)
              .setColor(0xe3c51b);

            return msg.channel.send(embed);
        };

        const reason = args.slice(members.size).join(' ');
        
        await Promise.all(
            [...members].map(member => new Promise(async res => {

                if (member.manageable) 
                    await member.roles.add(muteRole, reason || 'Nenhum motivo foi registrado.')
                        .then(member => mutedMembers.add(member.id))
                        .catch();
                
                res();
                
            }))
        );

        const MakeEmbed = () => {
            if (members.size < 2) {
        
                const member = [...members][0];
    
                if (mutedMembers.has(member.id)) {
                    embed
                      .setDescription(`✅ \`${member.user.tag}\` **foi mutado(a) com sucesso.**`)
                      .setColor(0x27db27);
                    
                    return;
                }

                embed
                  .setDescription(`:person_gesturing_no: **Não foi possivel realizar o mute do membro.**`)
                  .setColor(0xF44336);
    
            } else {
    
                if (mutedMembers.size) {
                    embed
                      .setTitle('Membros mutados')
                      .setDescription([...members].map(m => 
                        `${mutedMembers.has(m.id) ? '✅' : '❌'} **${m.user.tag}**`).join('\n')
                      );

                    return;
                }

                embed
                  .setDescription(`:person_gesturing_no: **Não foi possivel realizar o mute de nenhum dos membros citados.**`)
                  .setColor(0xF44336);
                
            }
        }

        MakeEmbed();

        msg.channel.send(embed);
        
    }
}

module.exports = Mute;