
module.exports = Bot => {
    const cmds = require('../config/js/Commands');

    cmds.forEach(cmdClass => {
        const cmd = new cmdClass();

        Bot.commands.set(cmd.name.toLowerCase(), cmd);

        cmd.aliases.forEach(alias => {
            Bot.aliases.set(alias.toLowerCase(), cmd);
        });
    });

    return cmds;
}