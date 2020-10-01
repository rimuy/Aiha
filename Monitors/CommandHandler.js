
class CommandHandler {
    constructor(Bot) {
        const cmds = require('../Configuration/js/Commands');
        cmds.forEach(cmd => Bot.commands.add(new cmd()));
    }
}

module.exports = CommandHandler;