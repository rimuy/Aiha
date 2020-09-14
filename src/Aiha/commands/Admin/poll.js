
/**
 *      Kevinwkz - 2020/09/07
 */

const { Command, BaseEmbed } = require('../..');

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

class Poll extends Command {
    constructor() {
        super('poll', {
            description: 'Cria uma enquete com reactions para cada opção.',
            usage: 'poll `título` **:** `"opções[]"`',
            aliases: ['enquete'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
            multiChannel: true,
        });
    }
    
    async run(Bot, msg, args) {
       
        const embed = new BaseEmbed();

        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

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