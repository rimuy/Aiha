/**
 *      Kevinwkz - 2020/09/02
 */

const { Internals } = require('../..');

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
        });
    }

    run(_, msg, args) {

        if (!args.length) return;

        const question = args
            .join(' ')
            .split('\n')
            .join('\n> ');

        const embed = new Internals.BaseEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`> ${question}\n\n🔮 **Resposta:** ${responses[Math.floor(Math.random() * responses.length)]}.`);

        msg.channel.send(embed);

    }
}

module.exports = EightBall;