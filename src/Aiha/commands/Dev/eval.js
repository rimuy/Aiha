/**
 *      Kevinwkz - 2020/08/27
 */

const { 
    Command, BaseEmbed, PageEmbed, 
    MudaeObserver, Status,
    API, Server, ZeroWidthSpace 
} = require('../..');

const { inspect } = require('util');
const { color } = require('./.config.json');
const Discord = require('discord.js');

class Eval extends Command {
    constructor() {
        super('eval', {
            category: 'Developer',
            aliases: ['$'],
            hidden: true,
            dev: true,
        });
    }
    
    async run(Bot, msg, args) {
       
        args = args.join(' ').split('$', 2);
        const page = Math.max(0, parseInt(args[1] || '0') - 1);

        const md = 'js';
        const limit = 30;

        /* Shortcut variables */
        const Client = Bot.client;
        const me = msg.author;
        const guild = msg.guild;
        const users = Client.users;
        const members = Client.members;
        
        try {
            let evaled = await eval(args[0]);
            if (typeof evaled !== 'string') evaled = inspect(evaled);
            
            evaled = evaled.split('\n');

            new PageEmbed(
                msg, 
                evaled
                    .map((e, i) => {
                        if (!(i % limit)) return `\`\`\`${md}\n${e}${i === evaled.length - 1 ? `\`\`\`` : ''}`;
                        if (!((i + 1) % limit) || i === evaled.length - 1) return `${e}\n\`\`\``;
    
                        return e;
                    }),
                limit,
                page,
            )
                .setTitle(`${Bot.emojis.get('botdev')}${`\ ${ZeroWidthSpace}`.repeat(4)}Saída`)
                .setColor(color)
                .send();
        } catch(e) {
            
            msg.channel.send(
                new BaseEmbed()
                    .setTitle(`${Bot.emojis.get('bot2Cancel')}${`\ ${ZeroWidthSpace}`.repeat(4)}Erro`)
                    .setDescription(`\`\`\`${md}\n${e}\n\`\`\``)
                    .setColor(0xF44336)
            );

        }

    }
}

module.exports = Eval;