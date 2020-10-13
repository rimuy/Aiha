/**
 *      Kevinwkz - 2020/09/10
 */

const { Internals, API } = require('../..');
const { color } = require('./.config.json');

class Slap extends Internals.Command {
    constructor() {
        super('slap', {
            description: 'Dá um tapa no usuário mencionado.',
            usage: 'slap `[@membro]`',
            aliases: [],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(msg) {

        const bot = msg.instance;
        const slapped = msg.mentions.users.first() || msg.author;
        const req = await API.NekosLife.slap;

        const error = bot.emojis.get('bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setColor(color)
            .setDescription(`💢 **${msg.author.username}** ${
                slapped.equals(msg.author) ? 'deu um tapa em si mesmo.' : `deu um tapa em <@${slapped.id}>`
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

module.exports = Slap;