/**
 *      Kevinwkz - 2020/09/03
 */

const { Internals, Server } = require('../..');

class Top extends Internals.Command {
    constructor() {
        super('top', {
            description: 'Exibe o ranking dos membros do servidor.',
            usage: 'top',
            aliases: [],
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(msg) {

        const instance = msg.instance;
        const users = await Server.Database.request('GET', 'users');
        const limit = 10;

        if (!Object.keys(users).length) {
            return msg.channel.send(
                new Internals.BaseEmbed().setDescription('Este servidor não possui nenhum membro com level.')
            );
        }

        const ranking = Object.keys(users)
            .filter(u => users[u].level > 0 && users[u].level < 999999)
            .sort((a, b) => {
                return users[b].level - users[a].level;
            })
            .map((id, idx) => { 
                return { id, level: users[id].level, order: ++idx };
            });

        const medals = ['🥇', '🥈', '🥉'];
        const userData = ranking.find(obj => obj.id === msg.author.id);

        const membersRanking = await Promise.all(
            ranking.map((obj, idx) => {
                const member = msg.guild.members.cache.get(obj.id);

                return `${

                    !(idx % limit) 
                        ? `${instance.emojis.get('bot2QuestionMark')}` + (
                            userData 
                                ? ` Seu rank atual é: **#${userData.order}**` 
                                : ' Você não possui um rank.'
                        ) + '\n\n' 
                        : ''

                }**#${++idx}:**${
                    (' ' + Internals.Constants.ZeroWidthSpace).repeat(8)
                }\`${member ? member.user.tag : obj.id}\`${
                    (' ' + Internals.Constants.ZeroWidthSpace).repeat(8)
                }LVL ${obj.level} ${medals[idx - 1] || ''}`;
            })
        );

        new Internals.PageEmbed(msg, membersRanking, limit)
            .setAuthor('Placar do Servidor', msg.guild.iconURL({ dynamic: true }))
            .send();
        
    }
}

module.exports = Top;