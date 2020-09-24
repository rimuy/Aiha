/**
 *      Kevinwkz - 2020/09/24
 */

const { Command, BaseEmbed, API } = require('../..');

class WeebAvatar extends Command {
    constructor() {
        super('weebAvatar', {
            description: 'Imagem aleatória de avatar.',
            usage: 'weebAvatar',
            aliases: [],
            category: 'Imagem',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(Bot, msg) {

        const req = await API.NekosLife.avatar;
        const error = Bot.emojis.get('bot2Cancel');

        const embed = new BaseEmbed()
            .setTitle('Avatar aleatório')
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

module.exports = WeebAvatar;