/**
 *      Kevinwkz - 2020/08/03
 */

const { Command } = require('../..');
const { MessageAttachment } = require('discord.js');
const moment = require('moment-timezone');
const Path = require('path');

const filePath = Path.resolve(__dirname, '..', '..', '..', '..', 'server', 'Adapter.json');

class Backup extends Command {
    constructor() {
        super('backup', {
            category: 'Developer',
            hidden: true,
            dev: true,
        });
    }
    
    run(Bot, msg, _, auto) {

        const attachment = new MessageAttachment(
            filePath, 
            `${moment().format('YYYYMMDDhhmmss')}-database.json`
        );

        msg.author.send('', attachment)
            .then(() => { 
                if (!auto) return msg.react(Bot.emojis.get('bot2Success'));
            })
            .catch();

    }
}

module.exports = Backup;