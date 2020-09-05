/**
 *      Kevinwkz - 2020/08/27
 */

const { Command } = require('../..');

class Unlock extends Command {
    constructor() {
        super('unlock', {
            description: 'Desbloqueia o chat em que o comando foi executado.',
            usage: 'unlock',
            category: 'Moderação',
            userPerms: ['MANAGE_CHANNELS']
        });
    }

    run(Bot, msg, args) {

        const everyone = msg.guild.roles.everyone;
        const channel = msg.channel;

        if (msg.guild.me.permissionsIn(channel).has('VIEW_CHANNEL')) {
            channel.createOverwrite(everyone, { SEND_MESSAGES: true })
                .then(() => msg.react('✅'))
                .catch(() => msg.react('❌').catch());
        };
        
    }
}

module.exports = Unlock;