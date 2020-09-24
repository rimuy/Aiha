/**
 *      Kevinwkz - 2020/09/24
 */

const { Command, BaseEmbed, API } = require('../..');

class Smug extends Command {
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

    async run(Bot, msg) {

        const target = msg.mentions.users.first() || msg.author;
        const req = await API.NekosLife.smug;

        const error = Bot.emojis.get('bot2Cancel');

        const embed = new BaseEmbed()
            .setDescription(`💮 **${msg.author.username}** ${
                target.equals(msg.author) ? 'sorriu pretensiosamente.' : `sorriu pretensiosamente para <@${target.id}>`
            }`)
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

module.exports = Smug;