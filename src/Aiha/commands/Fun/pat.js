/**
 *      Kevinwkz - 2020/09/10
 */

const { Command, BaseEmbed } = require('../..');

class Pat extends Command {
    constructor() {
        super('pat', {
            description: 'Afaga o usuário mencionado.',
            usage: 'pat `[@membro]`',
            aliases: [],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
        });
    }

    async run(Bot, msg) {

        const pet = msg.mentions.users.first() || msg.author;
        const req = await Bot.api.NekosLife.pat;

        const error = Bot.emojis.get('bot2Cancel');

        const embed = new BaseEmbed()
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