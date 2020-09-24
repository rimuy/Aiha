/**
 *      Kevinwkz - 2020/09/24
 */

const { Command, BaseEmbed, API } = require('../..');

class Wallpaper extends Command {
    constructor() {
        super('wallpaper', {
            description: 'Imagem aleatória de papel de parede.',
            usage: 'wallpaper',
            aliases: [],
            category: 'Imagem',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(Bot, msg) {

        const req = await API.NekosLife.wallpaper;
        const error = Bot.emojis.get('bot2Cancel');

        const embed = new BaseEmbed()
            .setTitle('Wallpaper aleatório')
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

module.exports = Wallpaper;