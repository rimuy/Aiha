/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals } = require('../..');
const { MessageEmbed } = require('discord.js');

class Unban extends Internals.Command {
    constructor() {
        super('unban', {
            description: 'Desbane todos os usuários citados.',
            usage: 'unban `<@membro>` `[motivo]`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['BAN_MEMBERS']
        });
    }

    async run(Bot, msg, args, soft) {

        const bannedList = await msg.guild.fetchBans();
        const unbannedUsers = new Set();
        const embed = new MessageEmbed().setColor(0x1ba4e3);

        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

        if (!bannedList.size) {
            embed
                .setDescription(`${exclamation} **Não há nenhum usuário banido neste servidor.**`)
                .setColor(0xe3c51b);

            return msg.channel.send(embed);
        }
        
        const promise = await Promise.all(
            [...bannedList]
                .filter(bi => args.includes(bi[0]))
                .map(banInfo => new Promise(res => {

                    msg.guild.members.unban(banInfo[1].user)
                        .then(user => unbannedUsers.add(user.id))
                        .catch()
                        .finally(res);
                    
                }))
        );

        if (soft) return promise;

        const MakeEmbed = () => {
            if (bannedList.size < 2) {
        
                const userinfo = [...bannedList][0];
    
                if (unbannedUsers.has(userinfo[0])) {
                    embed
                        .setDescription(`${success} \`${userinfo[1].user.tag}\` **foi desbanido(a) com sucesso.**`)
                        .setColor(0x27db27);
                    
                    return;
                }

                embed
                    .setDescription(':person_gesturing_no: **Não foi possivel realizar o desbanimento do usuário.**')
                    .setColor(0xF44336);
    
            } else {
    
                if (unbannedUsers.size) {
                    embed
                        .setTitle('Usuários desbanidos')
                        .setDescription([...bannedList].map(u => 
                            `${unbannedUsers.has(u[0]) ? success : error} **${u[1].user.tag}**`).join('\n')
                        );

                    return;
                }

                embed
                    .setDescription(':person_gesturing_no: **Não foi possivel desbanir nenhum dos usuários citados.**')
                    .setColor(0xF44336);
                
            }
        };

        MakeEmbed();

        msg.channel.send(embed);
        
    }
}

module.exports = Unban;