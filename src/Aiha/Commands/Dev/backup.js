/**
 *      Kevinwkz - 2020/08/03
 */

const { Internals } = require('../..');
const { MessageAttachment, User } = require('discord.js');
const moment = require('moment-timezone');
const Path = require('path');

const filePath = Path.resolve(__dirname, '..', '..', '..', '..', 'server', 'Adapter.json');

class Backup extends Internals.Command {
    constructor() {
        super('backup', {
            category: 'Developer',
            aliases: ['b'],
            hidden: true,
            dev: true,
        });
    }
    
    run(Bot, msg, developer) {

        const isUser = developer instanceof User;
        if (!msg && !isUser) return;

        const user = isUser
            ? developer
            : msg.author;

        const attachment = new MessageAttachment(
            filePath, 
            `${moment().format('YYYYMMDDhhmmss')}-database.json`
        );

        user.send('', attachment)
            .then(() => { 
                if (!isUser) return msg.react(Bot.emojis.get('bot2Success'));
            })
            .catch();

    }
}

module.exports = Backup;