/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals } = require('../..');

class Lock extends Internals.Command {
    constructor() {
        super('lock', {
            description: 'Bloqueia o chat em que o comando foi executado.',
            usage: 'lock',
            category: 'Moderação',
            userPerms: ['MANAGE_CHANNELS']
        });
    }

    run(Bot, msg) {

        const everyone = msg.guild.roles.everyone;
        const channel = msg.channel;

        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');

        if (msg.guild.me.permissionsIn(channel).has(['VIEW_CHANNEL', 'MANAGE_CHANNELS'])) {
            channel.createOverwrite(everyone, { SEND_MESSAGES: false })
                .then(() => msg.react(success))
                .catch(() => msg.react(error).catch());
        }
        
    }
}

module.exports = Lock;