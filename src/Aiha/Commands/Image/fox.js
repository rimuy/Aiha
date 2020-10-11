/**
 *      Kevinwkz - 2020/09/24
 */

const { Internals, API } = require('../..');

class Fox extends Internals.Command {
    constructor() {
        super('fox', {
            description: 'Imagem aleatória de raposas em anime.',
            usage: 'fox',
            aliases: [],
            category: 'Imagem',
            botPerms: ['EMBED_LINKS'],
        });
    }

    async run(msg) {

        const bot = msg.instance;
        const req = await API.NekosLife.fox;
        const error = bot.emojis.get('bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setTitle('🦊')
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

module.exports = Fox;