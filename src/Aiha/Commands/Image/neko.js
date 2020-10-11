/**
 *      Kevinwkz - 2020/09/24
 */

const { Internals, API } = require('../..');

class Neko extends Internals.Command {
    constructor() {
        super('neko', {
            description: 'Imagem aleatória de gatos em anime.',
            usage: 'neko',
            aliases: [],
            category: 'Imagem',
            botPerms: ['EMBED_LINKS'],
        });
    }

    async run(msg) {

        const bot = msg.instance;

        const req = await [
            API.NekosLife.neko, 
            API.NekosLife.nekogif
        ][
            Math.floor(Math.random() * 2)
        ];

        const error = bot.emojis.get('bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setTitle('🐱 ~ Meow')
            .setFooter(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true, size: 4096 }))
            .setImage(req.url);

        msg.target.send(embed)
            .catch(e => {
                msg.target.send(
                    embed
                        .setDescription(`${error} **${e.message}**`)
                        .setColor(0xF44336)
                );
            });

    }
}

module.exports = Neko;