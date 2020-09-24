/**
 *      Kevinwkz - 2020/09/24
 */

const { Command, BaseEmbed, API } = require('../..');

class Fox extends Command {
    constructor() {
        super('fox', {
            description: 'Imagem aleatória de raposas em anime.',
            usage: 'fox',
            aliases: [],
            category: 'Imagem',
            botPerms: ['EMBED_LINKS'],
        });
    }

    async run(Bot, msg) {

        const req = await API.NekosLife.fox;
        const error = Bot.emojis.get('bot2Cancel');

        const embed = new BaseEmbed()
            .setTitle('🦊')
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

module.exports = Fox;