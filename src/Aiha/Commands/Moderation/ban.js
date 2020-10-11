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
            userPerms: ['BAN_MEMBERS'],
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args, _, soft) {

        const bot = msg.instance;
        const ids = new Set();
        const bannedMembers = new Set();
        const embed = new MessageEmbed().setColor(0x1ba4e3);

        const success = bot.emojis.get('bot2Success');
        const error = bot.emojis.get('bot2Cancel');
        const exclamation = bot.emojis.get('bot2Exclamation');

        args.slice(0, args.length).forEach(m => ids.add({ id: m.replace(/[<@>]/g, '') }));

        if (!ids.size) {
            embed
                .setDescription(`${exclamation} **Por favor, indique um membro válido.**`)
                .setColor(0xe3c51b);

            return msg.target.send(embed);
        }

        const reason = args.slice(ids.size).join(' ') || 'Nenhum motivo foi registrado.';
        
        await new Promise(res => {

            [...ids].forEach(async (m, i) => {
                const member = await msg.guild.members.fetch(m.id).catch(() => false);
    
                if (member) {
    
                    if (member.bannable && !member.permissions.has(this.userPerms)) 
                        await msg.guild.members.ban(member.id, { days: soft ? 7 : 1, reason })
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
                            .catch();
                } else {

                    await msg.guild.members.ban(m.id)
                        .then(() => bannedMembers.add({ id: m.id }))
                        .catch(() => []);
        
                }

                if (i === ids.size - 1) res();
            });

        });

        if (soft) return;

        const MakeEmbed = () => {
            if (ids.size < 2) {
        
                const member = [...ids][0];
    
                if ([...bannedMembers].find(bn => bn.id === member.id)) {
                    embed
                        .setDescription(`${success} \`${member.user ? member.user.tag : member.id}\` **foi banido(a) com sucesso.**`)
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
                        .setDescription([...ids].map(m => 
                            `${[...bannedMembers].find(bn => bn.id === m.id) ? success : error} **${m.user ? m.user.tag : m.id}**`).join('\n')
                        );

                    return;
                }

                embed
                    .setDescription(':person_gesturing_no: **Não foi possivel realizar o banimento de nenhum dos membros citados.**')
                    .setColor(0xF44336);
                
            }
        };

        MakeEmbed();

        msg.target.send(embed);
        
    }
}

module.exports = Ban;