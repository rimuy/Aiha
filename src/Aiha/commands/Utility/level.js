/**
 *      Kevinwkz - 2020/09/03
 */

const { Command, BaseEmbed, Server } = require('../..');

class Level extends Command {
    constructor() {
        super('level', {
            description: 'Exibe o seu level ou o do membro citado e ranking do servidor.',
            usage: 'level',
            aliases: ['rank'],
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(Bot, msg) {

        const users = await Server.Database.request('GET', 'users');
        const data = users[msg.author.id];
        const embed = new BaseEmbed();

        if (data) {

            const ranking = Object.keys(users)
                .filter(u => users[u].level > 0)
                .sort((a, b) => {
                    return users[b].level - users[a].level;
                })
                .map((id, idx) => { 
                    return { id, level: users[id].level, order: ++idx };
                });

            embed
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Level', value: data.level, inline: true },
                    { name: 'Rank', value: '#' + ranking.find(obj => obj.id === msg.author.id).order, inline: true },
                );
        } else {
            embed.setDescription('Você ainda não possui uma conta registrada.');
        }

        msg.channel.send(embed);
        
    }
}

module.exports = Level;