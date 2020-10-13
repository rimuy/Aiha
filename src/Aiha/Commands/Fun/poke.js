/**
 *      Kevinwkz - 2020/09/24
 */

const { Internals, API } = require('../..');
const { color } = require('./.config.json');

class Poke extends Internals.Command {
    constructor() {
        super('poke', {
            description: 'Cutuca o usuário mencionado.',
            usage: 'poke `[@membro]`',
            aliases: [],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(msg) {

        const bot = msg.instance;
        const pet = msg.mentions.users.first() || msg.author;
        const req = await API.NekosLife.poke;

        const error = bot.emojis.get('bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setColor(color)
            .setDescription(`👉 **${msg.author.username}** ${
                pet.equals(msg.author) ? 'cutucou a si mesmo D:' : `cutucou <@${pet.id}>`
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

module.exports = Poke;