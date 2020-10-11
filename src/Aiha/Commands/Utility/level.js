/**
 *      Kevinwkz - 2020/09/03
 */

const { Internals, Server } = require('../..');

class Level extends Internals.Command {
    constructor() {
        super('level', {
            description: 'Exibe o seu level ou o do membro citado e ranking do servidor.',
            usage: 'level',
            aliases: ['rank'],
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(msg) {

        const user = msg.mentions.users.first() || msg.author;
        const users = await Server.Database.request('GET', 'users');
        const data = users[user.id];
        const embed = new Internals.BaseEmbed();

        if (data) {

            const ranking = Object.keys(users)
                .filter(u => users[u].level > 0 && users[u].level < 999999)
                .sort((a, b) => {
                    return users[b].level - users[a].level;
                })
                .map((id, idx) => { 
                    return { id, level: users[id].level, order: ++idx };
                });

            embed
                .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { 
                        name: `🔸 Level ${data.level}`, 
                        value: data.level < 999999 
                            ? `EXP: \`${data.exp}\`**/**\`${150 + ( 225 * data.level )}\``
                            : 'EXP: `inf`**/**`inf`', 
                        inline: true 
                    },
                    { 
                        name: '📊 Rank', 
                        value: data.level < 999999 
                            ? `#**${(ranking.find(obj => obj.id === user.id) || { order: 'N/A' } ).order}**`
                            : '#**0**', 
                        inline: true 
                    },
                );
        } else {
            embed.setDescription('Este usuário ainda não possui uma conta registrada.');
        }

        msg.target.send(embed);
        
    }
}

module.exports = Level;