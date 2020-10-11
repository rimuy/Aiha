/**
 *      Kevinwkz - 2020/09/02
 */

const { Internals } = require('../..');
const { MessageEmbed } = require('discord.js');

const choices = [
    'Pedra',
    'Papel',
    'Tesoura'
];

class RPS extends Internals.Command {
    constructor() {
        super('rps', {
            description: 'Pedra, papel ou tesoura :D',
            usage: 'rps `<escolha>`',
            aliases: ['ppt'],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            blockFlags: ['double'],
        });
    }

    run(msg, args) {

        const choice = args[0];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        if (!choice || !choices.some(c => c.toLowerCase() === choice.toLowerCase())) {
            return msg.target.send(
                new MessageEmbed()
                    .setColor(0xe3c51b)
                    .setDescription('⚠️ **Escolha entre pedra, papel ou tesoura.**')
            );
        }

        msg.target.send(
            new Internals.BaseEmbed()
                .setDescription(`**Minha escolha:** ${botChoice}`)
        );

    }
}

module.exports = RPS;