/**
 *      Kevinwkz - 2020/08/27
 */

const { Command } = require('../..');
const { MessageEmbed } = require('discord.js');

class Ping extends Command {
    constructor() {
        super('ping', {
            description: 'Exibe o ping do bot.',
            usage: 'ping',
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(Bot, msg) {

        const embed = new MessageEmbed()
            .setColor(0x2F3136)
            .setDescription(`**Ping:** \`${Bot.client.ws.ping}\` ms`);

        msg.channel.send(embed);

    }
}

module.exports = Ping;