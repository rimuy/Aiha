/**
 *      Kevinwkz - 2020/09/24
 */

const { Internals, API } = require('../..');

class Tickle extends Internals.Command {
    constructor() {
        super('tickle', {
            description: 'Faz cócegas no usuário mencionado.',
            usage: 'tickle `[@membro]`',
            aliases: ['cocegas'],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run( msg) {

        const bot = msg.instance;
        const pet = msg.mentions.users.first() || msg.author;
        const req = await API.NekosLife.tickle;

        const error = bot.emojis.get('bot2Cancel');

        const embed = new Internals.BaseEmbed()
            .setDescription(`✨ **${msg.author.username}** ${
                pet.equals(msg.author) ? 'fez cócegas em si mesmo D:' : `fez cócegas em <@${pet.id}>`
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

module.exports = Tickle;