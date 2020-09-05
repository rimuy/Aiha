/**
 *      Kevinwkz - 2020/08/27
 */

const { Command } = require('../..');
const { MessageEmbed } = require('discord.js');

class Ban extends Command {
    constructor() {
        super('ban', {
            description: 'Bane todos os membros citados.',
            usage: 'ban `<@membro>` `[motivo]`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['BAN_MEMBERS']
        });
    }

    async run(Bot, msg, args, soft) {

        const members = new Set();
        const bannedMembers = new Set();
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

                if (member.bannable) 
                    await member.ban({ days: soft ? 7 : 0, reason: reason || 'Nenhum motivo foi registrado.' })
                        .then(member => bannedMembers.add(member.id))
                        .catch()
                        .finally(res);
                
                res(false);
                
            }))
        );

        if (soft) return;

        const MakeEmbed = () => {
            if (members.size < 2) {
        
                const member = [...members][0];
    
                if (bannedMembers.has(member.id)) {
                    embed
                      .setDescription(`✅ \`${member.user.tag}\` **foi banido(a) com sucesso.**`)
                      .setColor(0x27db27);
                    
                    return;
                }

                embed
                  .setDescription(`:person_gesturing_no: **Não foi possivel realizar o banimento do membro.**`)
                  .setColor(0xF44336);
    
            } else {
    
                if (bannedMembers.size) {
                    embed
                      .setTitle('Membros banidos')
                      .setDescription([...members].map(m => 
                        `${bannedMembers.has(m.id) ? '✅' : '❌'} **${m.user.tag}**`).join('\n')
                      );

                    return;
                }

                embed
                  .setDescription(`:person_gesturing_no: **Não foi possivel realizar o banimento de nenhum dos membros citados.**`)
                  .setColor(0xF44336);
                
            }
        }

        MakeEmbed();

        msg.channel.send(embed);
        
    }
}

module.exports = Ban;