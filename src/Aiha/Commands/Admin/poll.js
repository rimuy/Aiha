
/**
 *      Kevinwkz - 2020/09/07
 */

const { Internals } = require('../..');
const { color } = require('./.config.json');

const separator = ':';
const emojis = [
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
    '�'
];

class Poll extends Internals.Command {
    constructor() {
        super('poll', {
            description: 'Cria uma enquete com reactions para cada opção.',
            usage: 'poll `título` **:** `"opções[]"`',
            aliases: ['enquete'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
            blockFlags: ['delete', 'private'],
            multiChannel: true,
        });
    }
    
    async run(msg, args) {
       
        const bot = msg.instance;
        const embed = new Internals.BaseEmbed().setColor(color);

        const error = bot.emojis.get('name', 'bot2Cancel');
        const exclamation = bot.emojis.get('name', 'bot2Exclamation');

        const slice = args.join(' ').split(separator);
        const title = slice[0];
        const matches = slice[1];

        if (!title) {
            return msg.channel.send(
                embed
                    .setDescription(`${exclamation} **É preciso definir o título e as escolhas.**`)
                    .setColor(0xe3c51b)
            );
        }
        else if (!matches) {
            return msg.channel.send(
                embed
                    .setDescription(`${error} **Escolhas inválidas.**`)
                    .setColor(0xF44336)
            );
        }

        msg.delete().catch(() => {});

        const choices = matches
            .trim()
            .split('" ')
            .filter(e => e.length)
            .slice(0, 10);

        embed
            .setTitle(title)
            .setDescription(choices.map((c, i) => `${emojis[i]} ${c.replace(/"/g, '')}\n`))
            .setFooter(`Enquete de ${msg.author.tag}`);

        msg.channel.send(embed)
            .then(m => {
                choices.forEach(async (_, i) => 
                    await m.react(emojis[i])).catch(() => {});
            })
            .catch(() => {});
    }
}

module.exports = Poll;