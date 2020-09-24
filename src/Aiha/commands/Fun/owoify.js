/**
 *      Kevinwkz - 2020/09/10
 */

const { Command, BaseEmbed, API } = require('../..');

class OwOify extends Command {
    constructor() {
        super('owoify', {
            description: 'Transforma o texto.',
            usage: 'owoify `[texto]`',
            aliases: ['0w0ify'],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            multiChannel: true,
        });
    }

    async run(Bot, msg, args) {

        const lastMessage = msg.channel.messages.cache.last(2)[0];
        const text = args.length
            ? args.join(' ') 
            : (
                lastMessage 
                    ? lastMessage.content
                    : null
            );

        const error = Bot.emojis.get('bot2Cancel');

        if (!text) {
            return msg.channel.send(
                new BaseEmbed()
                    .setDescription(`${error} **Ocorreu um erro ao executar o comando.**`)
                    .setColor(0xF44336)
            );
        }

        msg.channel.startTyping();
        const transform = await API.NekosLife.owoify(text);
        msg.channel.send(transform.owo.replace(/:(.+):/g, ''))
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = OwOify;