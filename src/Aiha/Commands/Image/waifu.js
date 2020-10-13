/**
 *      Kevinwkz - 2020/09/24
 */

const { Internals, API } = require('../..');
const { color } = require('./.config.json');

class Waifu extends Internals.Command {
    constructor() {
        super('waifu', {
            description: 'Imagem aleatória de waifu.',
            usage: 'waifu',
            aliases: [],
            category: 'Imagem',
            botPerms: ['EMBED_LINKS'],
        });
    }

    async run(msg) {

        const bot = msg.instance;
        const hearts = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤎', '🤍'];
        const req = await API.NekosLife.waifu;
        const error = bot.emojis.get('bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setColor(color)
            .setTitle(`${hearts[Math.floor(Math.random() * hearts.length)]} Waifu`)
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

module.exports = Waifu;