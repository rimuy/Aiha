/**
 *      Kevinwkz - 2020/08/27
 */

const { Command } = require('../..');

class Lock extends Command {
    constructor() {
        super('lock', {
            description: 'Bloqueia o chat em que o comando foi executado.',
            usage: 'lock',
            category: 'Moderação',
            userPerms: ['MANAGE_CHANNELS']
        });
    }

    run(Bot, msg, args) {

        const everyone = msg.guild.roles.everyone;
        const channel = msg.channel;

        if (msg.guild.me.permissionsIn(channel).has(['VIEW_CHANNEL', 'MANAGE_CHANNELS'])) {
            channel.createOverwrite(everyone, { SEND_MESSAGES: false })
                .then(() => msg.react('✅'))
                .catch(() => msg.react('❌').catch());
        };
        
    }
}

module.exports = Lock;