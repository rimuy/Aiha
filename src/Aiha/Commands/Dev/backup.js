/**
 *      Kevinwkz - 2020/08/03
 */

const { Internals } = require('../..');
const { MessageAttachment, User } = require('discord.js');
const moment = require('moment-timezone');
const Path = require('path');

const filePath = Path.resolve(__dirname, '..', '..', '..', '..', 'Server', 'Adapter.json');

class Backup extends Internals.Command {
    constructor() {
        super('backup', {
            category: 'Developer',
            aliases: ['b'],
            hidden: true,
            dev: true,
        });
    }
    
    async run(msg, developer, instance) {

        const bot = (msg ? msg.instance : instance);

        const user = msg
            ? msg.author
            : developer;

        const attachment = new MessageAttachment(
            filePath, 
            `${moment().format('YYYYMMDDhhmmss')}-database.json`
        );

        await user.send('', attachment)
            .then(() => { 
                msg && msg.react(bot.emojis.get('bot2Success'));
            })
            .catch();

    }
}

module.exports = Backup;