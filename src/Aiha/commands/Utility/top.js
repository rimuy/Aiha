/**
 *      Kevinwkz - 2020/08/03
 */

const { Command, BaseEmbed } = require('../..');

class Top extends Command {
    constructor() {
        super('top', {
            description: 'Exibe o ranking dos membros do servidor.',
            usage: 'top',
            aliases: [],
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(Bot, msg) {

        const users = await Bot.server.request('GET', 'users');
        const embed = new BaseEmbed();

        if (!Object.keys(users).length) {
            return msg.channel.send(
                embed.setDescription(`Este servidor não possui nenhum membro com level.`)
            );
        }

        const ranking = Object.keys(users)
            .sort((a, b) => {
                return users[b].level - users[a].level;
            })
            .map((id, idx) => { 
                return { id, level: users[id].level, order: ++idx };
            });

        
        const membersRanking = await Promise.all(
            ranking.map(async (obj, idx) => {
                const member = await msg.guild.members.fetch(obj.id);

                return `**#${++idx}:** \`${member.user.tag}\``;
            })
        );

        embed
            .setAuthor('Placar do Servidor', msg.guild.iconURL({ dynamic: true }))
            .setDescription(`${membersRanking.join('\n')}`);

        msg.channel.send(embed);
        
    }
}

module.exports = Top;