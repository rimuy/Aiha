/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals } = require('../..');

class Unlock extends Internals.Command {
    constructor() {
        super('unlock', {
            description: 'Desbloqueia o chat em que o comando foi executado.',
            usage: 'unlock',
            category: 'Moderação',
            userPerms: ['MANAGE_CHANNELS']
        });
    }

    run(msg) {

        const bot = msg.instance;
        const everyone = msg.guild.roles.everyone;
        const channel = msg.channel;

        const success = bot.emojis.get('bot2Success');
        const error = bot.emojis.get('bot2Cancel');

        if (msg.guild.me.permissionsIn(channel).has('VIEW_CHANNEL')) {
            channel.createOverwrite(everyone, { SEND_MESSAGES: true })
                .then(() => msg.react(success))
                .catch(() => msg.react(error).catch());
        }
        
    }
}

module.exports = Unlock;