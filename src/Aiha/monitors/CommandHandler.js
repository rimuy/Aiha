
module.exports = Bot => {
    const cmds = require('../config/js/Commands');

    cmds.forEach(cmdClass => {
        const cmd = new cmdClass();

        Bot.commands.set(cmd.name, cmd);

        cmd.aliases.forEach(alias => {
            Bot.aliases.set(alias, cmd);
        });
    });

    return cmds;
}