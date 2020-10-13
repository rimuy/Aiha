/**
 *      Kevinwkz - 2020/09/24
 */

const { Internals, API } = require('../..');
const { color } = require('./.config.json');

class Wallpaper extends Internals.Command {
    constructor() {
        super('wallpaper', {
            description: 'Imagem aleatória de papel de parede.',
            usage: 'wallpaper',
            aliases: [],
            category: 'Imagem',
            botPerms: ['EMBED_LINKS'],
        });
    }

    async run(msg) {

        const bot = msg.instance;
        const req = await API.NekosLife.wallpaper;
        const error = bot.emojis.get('name', 'bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setColor(color)
            .setTitle('Wallpaper aleatório')
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

module.exports = Wallpaper;