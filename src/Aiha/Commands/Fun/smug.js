/**
 *      Kevinwkz - 2020/09/24
 */

const { Internals, API } = require('../..');

class Smug extends Internals.Command {
    constructor() {
        super('smug', {
            description: 'Sorriso pretensioso.',
            usage: 'smug `[@membro]`',
            aliases: [],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(msg) {

        const bot = msg.instance;
        const target = msg.mentions.users.first() || msg.author;
        const req = await API.NekosLife.smug;

        const error = bot.emojis.get('bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setDescription(`💮 **${msg.author.username}** ${
                target.equals(msg.author) ? 'sorriu pretensiosamente.' : `sorriu pretensiosamente para <@${target.id}>`
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

module.exports = Smug;