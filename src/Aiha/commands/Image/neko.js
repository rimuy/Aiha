/**
 *      Kevinwkz - 2020/09/24
 */

const { Command, BaseEmbed, API } = require('../..');

class Neko extends Command {
    constructor() {
        super('neko', {
            description: 'Imagem aleatória de gatos em anime.',
            usage: 'neko',
            aliases: [],
            category: 'Imagem',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(Bot, msg) {

        const req = await [
            API.NekosLife.neko, 
            API.NekosLife.nekogif
        ][
            Math.floor(Math.random() * 2)
        ];

        const error = Bot.emojis.get('bot2Cancel');

        const embed = new BaseEmbed()
            .setTitle('🐱 ~ Meow')
            .setFooter(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setImage(req.url);

        msg.channel.send(embed)
            .catch(e => {
                msg.channel.send(
                    embed
                        .setDescription(`${error} **${e.message}**`)
                        .setColor(0xF44336)
                );
            });

    }
}

module.exports = Neko;