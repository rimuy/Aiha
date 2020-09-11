/**
 *      Kevinwkz - 2020/09/10
 */

const { Command, BaseEmbed } = require('../..');

class Slap extends Command {
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

    async run(Bot, msg) {

        const slapped = msg.mentions.users.first() || msg.author;
        const req = await Bot.api.NekosLife.slap;

        const error = Bot.emojis.get('bot2Cancel');

        const embed = new BaseEmbed()
            .setDescription(`💢 **${msg.author.username}** ${
                slapped.equals(msg.author) ? 'deu um tapa em si mesmo.' : `deu um tapa em <@${slapped.id}>`
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

module.exports = Slap;