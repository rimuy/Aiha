/**
 *      Kevinwkz - 2020/09/22
 */

const { Internals } = require('../..');

class HelpAdmin extends Internals.Command {
    constructor() {
        super('helpadm', {
            description: 'Comando de help, só que pra admin.',
            usage: 'helpadm `[comando]`',
            aliases: ['ha'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
            multiChannel: true,
        });
    }

    run(msg) {

        const bot = msg.instance;
        const embed = new Internals.BaseEmbed()
            .setFooter(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }));

        embed
            .setTitle(`${bot.categoriesEmojis.get('Admin')} Lista de Comandos [Admin]`)
            .setDescription(
                bot.commands
                    .filter(c => c.category === 'Admin')
                    .map(c => {
                        return `\`${c.name}\``;
                    })
                    .join('**, **')
            );

        msg.target.send(embed);

    }
}

module.exports = HelpAdmin;