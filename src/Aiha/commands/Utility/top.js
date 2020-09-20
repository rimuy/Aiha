/**
 *      Kevinwkz - 2020/09/03
 */

const { Command, BaseEmbed, PageEmbed, Server } = require('../..');

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

        const users = await Server.Database.request('GET', 'users');

        if (!Object.keys(users).length) {
            return msg.channel.send(
                new BaseEmbed().setDescription('Este servidor não possui nenhum membro com level.')
            );
        }

        const ranking = Object.keys(users)
            .filter(u => users[u].level > 0)
            .sort((a, b) => {
                return users[b].level - users[a].level;
            })
            .map((id, idx) => { 
                return { id, level: users[id].level, order: ++idx };
            });

        const medals = ['🥇', '🥈', '🥉'];

        const membersRanking = await Promise.all(
            ranking.map(async (obj, idx) => {
                const member = await msg.guild.members.fetch(obj.id);

                return `**#${++idx}:** \`${member.user.tag}\` LVL ${obj.level} ${medals[idx - 1] || ''}`;
            })
        );

        new PageEmbed(msg, membersRanking, 10)
            .setAuthor('Placar do Servidor', msg.guild.iconURL({ dynamic: true }))
            .send();
        
    }
}

module.exports = Top;