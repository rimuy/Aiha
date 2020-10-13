/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals, ZeroWidthSpace } = require('../..');
const { color } = require('./.config.json');

class HelpDev extends Internals.Command {
    constructor() {
        super('helpdev', {
            category: 'Developer',
            dev: true,
        });
    }
    
    async run(msg) {
       
        const bot = msg.instance;
        const commands = bot.commands.filter(c => c.dev);

        const embed = new Internals.BaseEmbed()
            .setTitle(`${bot.emojis.get('name', 'botdev')} **Developer**`)
            .setDescription(commands.map((c, i) => `**<**\`${c.name}\`**/>**${ZeroWidthSpace}${i && !(i % 4) ? '\n' : ' '}`).join(''))
            .setColor(color);
        
        msg.target.send(embed);

    }
}

module.exports = HelpDev;