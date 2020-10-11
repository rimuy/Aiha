/**
 *      Kevinwkz - 2020/09/10
 */

const { Internals, API } = require('../..');

class Cuddle extends Internals.Command {
    constructor() {
        super('cuddle', {
            description: 'Acaricia o usuário mencionado.',
            usage: 'cuddle `[@membro]`',
            aliases: [],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(msg) {

        const bot = msg.instance;
        const target = msg.mentions.users.first();
        const embed = new Internals.BaseEmbed();
        const req = await API.NekosLife.cuddle;

        const error = bot.emojis.get('bot2Cancel');
        const exclamation = bot.emojis.get('bot2Exclamation');

        if (!target || target.equals(msg.author)) {
            return msg.target.send(
                embed
                    .setDescription(`${exclamation} **Não é possivel realizar esta ação si mesmo!**`)
                    .setColor(0xe3c51b)
            );
        }

        embed
            .setDescription(`💖 **${msg.author.username}** acariciou <@${target.id}>`)
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

module.exports = Cuddle;