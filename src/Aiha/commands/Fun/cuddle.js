/**
 *      Kevinwkz - 2020/09/10
 */

const { Command, BaseEmbed, API } = require('../..');

class Cuddle extends Command {
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

    async run(Bot, msg) {

        const target = msg.mentions.users.first();
        const embed = new BaseEmbed();
        const req = await API.NekosLife.cuddle;

        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

        if (!target || target.equals(msg.author)) {
            return msg.channel.send(
                embed
                    .setDescription(`${exclamation} **Não é possivel realizar esta ação si mesmo!**`)
                    .setColor(0xe3c51b)
            );
        }

        embed
            .setDescription(`💖 **${msg.author.username}** acariciou <@${target.id}>`)
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

module.exports = Cuddle;