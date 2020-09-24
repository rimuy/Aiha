/**
 *      Kevinwkz - 2020/09/24
 */

const { Command, BaseEmbed, API } = require('../..');

class Tickle extends Command {
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

    async run(Bot, msg) {

        const pet = msg.mentions.users.first() || msg.author;
        const req = await API.NekosLife.tickle;

        const error = Bot.emojis.get('bot2Cancel');

        const embed = new BaseEmbed()
            .setDescription(`✨ **${msg.author.username}** ${
                pet.equals(msg.author) ? 'fez cócegas em si mesmo D:' : `fez cócegas em <@${pet.id}>`
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

module.exports = Tickle;