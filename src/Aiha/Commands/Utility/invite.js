/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals } = require('../..');

class Invite extends Internals.Command {
    constructor() {
        super('invite', {
            description: 'Retorna o link do convite do servidor.',
            usage: 'invite',
            aliases: ['i', 'convite'],
            category: 'Utilidades'
        });
    }

    run(msg) {

        const response = `> ${msg.content.split(' ')[0]}\nhttps://discord.gg/${process.env.GUILD_INVITE_CODE}`;

        msg.author.send(response)
            .then(() => { msg.react('✅').catch(); })
            .catch(() => msg.channel.send(response));
    }
}

module.exports = Invite;