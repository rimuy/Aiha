/**
 *      Kevinwkz - 2020/09/10
 */

const { Internals, API } = require('../..');

class Pat extends Internals.Command {
    constructor() {
        super('pat', {
            description: 'Afaga o usuário mencionado.',
            usage: 'pat `[@membro]`',
            aliases: [],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(msg) {

        const bot = msg.instance;
        const pet = msg.mentions.users.first() || msg.author;
        const req = await API.NekosLife.pat;

        const error = bot.emojis.get('bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setDescription(`💞 **${msg.author.username}** ${
                pet.equals(msg.author) ? 'afagou a si mesmo D:' : `afagou <@${pet.id}>`
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

module.exports = Pat;