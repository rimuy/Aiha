/**
 *      Kevinwkz - 2020/09/10
 */

const { Internals, API } = require('../..');
const { color } = require('./.config.json');

class OwOify extends Internals.Command {
    constructor() {
        super('owoify', {
            description: 'Transforma o texto.',
            usage: 'owoify `[texto]`',
            aliases: ['0w0ify'],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            blockFlags: ['double', 'twice'],
            multiChannel: true,
        });
    }

    async run(msg, args) {

        const bot = msg.instance;
        const lastMessage = msg.channel.messages.cache.last(2)[0];
        const text = args.length
            ? args.join(' ') 
            : (
                lastMessage 
                    ? lastMessage.content
                    : null
            );

        const error = bot.emojis.get('name', 'bot2Cancel');

        if (!text) {
            return msg.target.send(
                new Internals.BaseEmbed()
                    .setColor(color)
                    .setDescription(`${error} **Ocorreu um erro ao executar o comando.**`)
                    .setColor(0xF44336)
            );
        }

        msg.channel.startTyping();
        const transform = await API.NekosLife.owoify(text);
        msg.target.send(transform.owo.replace(/:(.+):/g, ''))
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = OwOify;