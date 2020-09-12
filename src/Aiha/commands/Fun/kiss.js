/**
 *      Kevinwkz - 2020/09/10
 */

const { Command, BaseEmbed, API } = require('../..');

class Kiss extends Command {
    constructor() {
        super('kiss', {
            description: 'Beija o usuário mencionado.',
            usage: 'kiss `[@membro]`',
            aliases: [],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(Bot, msg) {

        const kissed = msg.mentions.users.first();
        const embed = new BaseEmbed();
        const req = await API.NekosLife.kiss;

        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

        if (!kissed || kissed.equals(msg.author)) {
            return msg.channel.send(
                embed
                    .setDescription(`${exclamation} **Não é possivel beijar a si mesmo!**`)
                    .setColor(0xe3c51b)
            );
        }

        embed
            .setDescription(`💝 **${msg.author.username}** deu um beijo em <@${kissed.id}>`)
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

module.exports = Kiss;