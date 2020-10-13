/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals, Modules } = require('../..');
const { MessageEmbed } = require('discord.js');
const { color } = require('./.config.json');

class Mute extends Internals.Command {
    constructor() {
        super('mute', {
            description: 'Silencia todos os membros citados.',
            usage: 'mute `<@membros[]>` `[tempo (Ex: 1h30m)]` `[motivo]`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_ROLES'],
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {

        const bot = msg.instance;
        const embed = new MessageEmbed().setColor(0xe3c51b);
        const muteRole = Modules.MuteRole.get(msg.guild) || await Modules.MuteRole.create(msg.guild);

        const success = bot.emojis.get('name', 'bot2Success');
        const error = bot.emojis.get('name', 'bot2Cancel');
        const exclamation = bot.emojis.get('name', 'bot2Exclamation');

        if (!muteRole) 
            return msg.target.send(
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

        const timeFormat = (args[members.size] || '');
        const reason = args.slice(members.size + 1).join(' ') || 'Nenhum motivo foi registrado.';

        const format = {
            hours: { 
                f: timeFormat.match(/(\d+)h/gi), 
                eq: 60*60000, 
                max: 72 
            },
            minutes: { 
                f: timeFormat.match(/(\d+)m/gi), 
                eq: 60000, 
                max: 59 
            },
            seconds: { 
                f: timeFormat.match(/(\d+)s/gi), 
                eq: 1000, 
                max: 59 
            },
        };

        let time = 0;

        Object.keys(format).forEach(key => {
            const table = format[key];

            if (table && table.f && table.f.length) 
                time += parseInt(table.f[0]) * Math.min(table.eq, table.max * table.eq);
        });

        await Promise.all(
            [...members].map(member => new Promise(res => {

                if (member.manageable && !member.permissions.has(this.userPerms)) 
                    member.mute({ 
                        moderator: msg.author.id,
                        guild: msg.guild.id,
                        time: time > 0 ? time : null,
                        reason,
                    })
                        .then(() => mutedMembers.add(member.id))
                        .catch()
                        .finally(res);

            }))
        );

        const MakeEmbed = () => {
            if (members.size < 2) {
        
                const member = [...members][0];
    
                if (mutedMembers.has(member.id)) {
                    const desc = time > 0 ? `por **\`${timeFormat}\`**.` : 'com sucesso.';

                    embed
                        .setDescription(`${success} \`${member.user.tag}\` **foi mutado(a) ${desc}**`)
                        .setColor(color);
                    
                    return;
                }

                embed
                    .setDescription(':person_gesturing_no: **Não foi possivel realizar o mute do membro.**')
                    .setColor(0xF44336);
    
            } else {
    
                if (mutedMembers.size) {
                    embed
                        .setTitle('Membros mutados')
                        .setColor(color)
                        .setDescription(time > 0 ? `**Tempo:** \`${timeFormat}\`\n\n` : '' + [...members].map(m => 
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

        msg.target.send(embed);
        
    }
}

module.exports = Mute;