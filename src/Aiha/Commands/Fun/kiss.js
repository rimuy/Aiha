/**
 *      Kevinwkz - 2020/09/10
 */

const { Internals, API } = require('../..');

class Kiss extends Internals.Command {
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

    async run(msg) {

        const bot = msg.instance;
        const kissed = msg.mentions.users.first();
        const embed = new Internals.BaseEmbed();
        const req = await API.NekosLife.kiss;

        const error = bot.emojis.get('bot2Cancel');
        const exclamation = bot.emojis.get('bot2Exclamation');

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

module.exports = Kiss;