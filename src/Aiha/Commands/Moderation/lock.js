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
            userPerms: ['MANAGE_CHANNELS'],
            blockFlags: ['double', 'twice'],
        });
    }

    run(msg) {

        const bot = msg.instance;
        const everyone = msg.guild.roles.everyone;
        const channel = msg.channel;

        const success = bot.emojis.get('name', 'bot2Success');
        const error = bot.emojis.get('name', 'bot2Cancel');

        channel.createOverwrite(everyone, { SEND_MESSAGES: false })
            .then(() => msg.react(success))
            .catch(() => msg.react(error).catch());
        
    }
}

module.exports = Lock;