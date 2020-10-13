/**
 *      Kevinwkz - 2020/09/02
 */

const { Internals } = require('../..');
const { color } = require('./.config.json');

const responses = [
    'Sim',
    'Não',
    'Talvez',
    'Nunca'
];

class EightBall extends Internals.Command {
    constructor() {
        super('8ball', {
            description: '🔮 Adivinhação',
            usage: '8ball `<pergunta>`',
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            blockFlags: ['double'],
        });
    }

    run(msg, args) {

        if (!args.length) return;

        const question = args
            .join(' ')
            .split('\n')
            .join('\n> ');

        const embed = new Internals.BaseEmbed()
            .setColor(color)
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`> ${question}\n\n🔮 **Resposta:** ${responses[Math.floor(Math.random() * responses.length)]}.`);

        msg.target.send(embed);

    }
}

module.exports = EightBall;