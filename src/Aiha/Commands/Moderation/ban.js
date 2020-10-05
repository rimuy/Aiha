/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals, Modules } = require('../..');
const { MessageEmbed } = require('discord.js');

class Ban extends Internals.Command {
    constructor() {
        super('ban', {
            description: 'Bane todos os membros citados.',
            usage: 'ban `<@membro>` `[motivo]`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['BAN_MEMBERS']
        });
    }

    async run(msg, args, soft) {

        const bot = msg.instance;
        const members = new Set();
        const bannedMembers = new Set();
        const embed = new MessageEmbed().setColor(0x1ba4e3);

        const success = bot.emojis.get('bot2Success');
        const error = bot.emojis.get('bot2Cancel');
        const exclamation = bot.emojis.get('bot2Exclamation');

        msg.mentions.members.forEach(m => members.add(m));

        if (!members.size) {
            embed
                .setDescription(`${exclamation} **Por favor, indique um membro válido.**`)
                .setColor(0xe3c51b);

            return msg.channel.send(embed);
        }

        const reason = args.slice(members.size).join(' ') || 'Nenhum motivo foi registrado.';
        
        await Promise.all(
            [...members].map(member => new Promise(res => {

                if (member.bannable && !member.permissions.has(this.userPerms)) 
                    msg.guild.members.ban(member.id, { days: soft ? 7 : 1, reason })
                        .then(user => {
                            bannedMembers.add(user.id);

                            const logEmbed = new Internals.BaseEmbed()
                                .setTitle('Membro Banido')
                                .addFields(
                                    { name: 'Usuário', value: `<@${user.id}>`, inline: true },
                                    { name: 'Motivo', value: `\`${reason}\``, inline: true },
                                );

                            Modules.Logs(msg.guild, logEmbed);
                        })
                        .catch()
                        .finally(res);
                
            }))
        );

        if (soft) return;

        const MakeEmbed = () => {
            if (members.size < 2) {
        
                const member = [...members][0];
    
                if (bannedMembers.has(member.id)) {
                    embed
                        .setDescription(`${success} \`${member.user.tag}\` **foi banido(a) com sucesso.**`)
                        .setColor(0x27db27);
                    
                    return;
                }

                embed
                    .setDescription(':person_gesturing_no: **Não foi possivel realizar o banimento do membro.**')
                    .setColor(0xF44336);
    
            } else {
    
                if (bannedMembers.size) {
                    embed
                        .setTitle('Membros banidos')
                        .setDescription([...members].map(m => 
                            `${bannedMembers.has(m.id) ? success : error} **${m.user.tag}**`).join('\n')
                        );

                    return;
                }

                embed
                    .setDescription(':person_gesturing_no: **Não foi possivel realizar o banimento de nenhum dos membros citados.**')
                    .setColor(0xF44336);
                
            }
        };

        MakeEmbed();

        msg.channel.send(embed);
        
    }
}

module.exports = Ban;