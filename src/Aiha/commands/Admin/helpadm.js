/**
 *      Kevinwkz - 2020/09/22
 */

const { Command, BaseEmbed } = require('../..');

class HelpAdmin extends Command {
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

    run(Bot, msg) {

        const embed = new BaseEmbed()
            .setFooter(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }));

        embed
            .setTitle(`${Bot.categoriesEmojis.get('Admin')} Lista de Comandos [Admin]`)
            .setDescription(
                Bot.commands
                    .filter(c => c.category === 'Admin')
                    .map(c => {
                        return `\`${c.name}\``;
                    })
                    .join('**, **')
            );

        msg.channel.send(embed);

    }
}

module.exports = HelpAdmin;