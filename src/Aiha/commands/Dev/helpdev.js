/**
 *      Kevinwkz - 2020/08/27
 */

const { Command, BaseEmbed } = require('../..');

class HelpDev extends Command {
    constructor() {
        super('helpdev', {
            category: 'Developer',
            dev: true,
        });
    }
    
    async run(Bot, msg, args) {
       
        const commands = Bot.commands.filter(c => c.dev);

        const embed = new BaseEmbed()
            .setTitle(`${Bot.emojis.get('botdev')} **Developer**`)
            .setDescription(commands.map((c, i) => `\`${c.name}\` ${!(i % 4) ? '\n' : ''}`).join('**, **'))
            .setColor(0x03b6fc);
        
        msg.channel.send(embed);

    }
}

module.exports = HelpDev;