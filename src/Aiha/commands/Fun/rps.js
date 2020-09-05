/**
 *      Kevinwkz - 2020/09/02
 */

const { Command, BaseEmbed } = require('../..');
const { MessageEmbed } = require('discord.js');

const choices = [
    'Pedra',
    'Papel',
    'Tesoura'
];

class RPS extends Command {
    constructor() {
        super('rps', {
            description: 'Pedra, papel ou tesoura :D',
            usage: 'rps `<escolha>`',
            aliases: ['ppt'],
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
        });
    }

    run(Bot, msg, args) {

        const choice = args[0];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        if (!choice || !choices.some(c => c.toLowerCase() === choice.toLowerCase())) {
            return msg.channel.send(
                new MessageEmbed()
                    .setColor(0xe3c51b)
                    .setDescription('⚠️ **Escolha entre pedra, papel ou tesoura.**')
            );
        }

        msg.channel.send(
            new BaseEmbed()
                .setDescription(`**Minha escolha:** ${botChoice}`)
        );

    }
}

module.exports = RPS;