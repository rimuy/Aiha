/**
 *      Kevinwkz - 2020/09/10
 */

const { Internals, API } = require('../..');
const { color } = require('./.config.json');

class Hug extends Internals.Command {
    constructor() {
        super('hug', {
            description: 'Abraça o usuário mencionado.',
            usage: 'hug `[@membro]`',
            aliases: [],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(msg) {

        const bot = msg.instance;
        const hugged = msg.mentions.users.first() || msg.author;
        const req = await API.NekosLife.hug;

        const error = bot.emojis.get('bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setColor(color)
            .setDescription(`💓 **${msg.author.username}** ${
                hugged.equals(msg.author) ? 'abraçou a si mesmo D:' : `abraçou <@${hugged.id}>`
            }`)
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

module.exports = Hug;