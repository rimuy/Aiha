/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals } = require('../..');
const { MessageEmbed } = require('discord.js');

class Ping extends Internals.Command {
    constructor() {
        super('ping', {
            description: 'Exibe o ping do bot.',
            usage: 'ping',
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(msg) {

        const embed = new MessageEmbed()
            .setColor(0x2F3136)
            .setDescription(`**Ping:** \`${msg.client.ws.ping}\` ms`);

        msg.target.send(embed);

    }
}

module.exports = Ping;