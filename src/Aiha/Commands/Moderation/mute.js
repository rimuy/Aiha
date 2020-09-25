/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals, Modules, Monitors } = require('../..');
const { MessageEmbed } = require('discord.js');

class Mute extends Internals.Command {
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
        const muteRole = Modules.MuteRole.get(msg.guild) || await Modules.MuteRole.create(msg.guild);

        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

        if (!muteRole) 
            return msg.channel.send(
                embed
                    .setDescription(`${error} **Não foi possível criar o cargo de mute.**`)
                    .setColor(0xF44336)
            );

        embed.setColor(0x1ba4e3);

        const members = new Set();
        const mutedMembers = new Set();
        
        msg.mentions.members.forEach(m => !m.roles.cache.has(muteRole.id) && members.add(m));

        if (!members.size) {
            embed
                .setDescription(`${exclamation} **Por favor, indique um membro válido.**`)
                .setColor(0xe3c51b);

            return msg.channel.send(embed);
        }

        const reason = args.slice(members.size).join(' ') || 'Nenhum motivo foi registrado.';
        
        await Promise.all(
            [...members].map(member => new Promise(res => {

                if (member.manageable && !member.permissions.has(this.userPerms)) 
                    member.roles.add(muteRole, reason)
                        .then(async member => {
                            mutedMembers.add(member.id);

                            const logEmbed = new Internals.BaseEmbed()
                                .setTitle('Membro Silenciado')
                                .addFields(
                                    { name: 'Usuário', value: `<@${member.id}>`, inline: true },
                                    { name: 'Motivo', value: `\`${reason}\``, inline: true },
                                );

                            await Monitors.Muteds.add(member.id, { 
                                moderator: msg.author.id,
                                reason,
                            });

                            Modules.Logs(Bot, msg.channel, logEmbed);
                        })
                        .catch()
                        .finally(res);
                
            }))
        );

        const MakeEmbed = () => {
            if (members.size < 2) {
        
                const member = [...members][0];
    
                if (mutedMembers.has(member.id)) {
                    embed
                        .setDescription(`${success} \`${member.user.tag}\` **foi mutado(a) com sucesso.**`)
                        .setColor(0x27db27);
                    
                    return;
                }

                embed
                    .setDescription(':person_gesturing_no: **Não foi possivel realizar o mute do membro.**')
                    .setColor(0xF44336);
    
            } else {
    
                if (mutedMembers.size) {
                    embed
                        .setTitle('Membros mutados')
                        .setDescription([...members].map(m => 
                            `${mutedMembers.has(m.id) ? success : error} **${m.user.tag}**`).join('\n')
                        );

                    return;
                }

                embed
                    .setDescription(':person_gesturing_no: **Não foi possivel realizar o mute de nenhum dos membros citados.**')
                    .setColor(0xF44336);
                
            }
        };

        MakeEmbed();

        msg.channel.send(embed);
        
    }
}

module.exports = Mute;