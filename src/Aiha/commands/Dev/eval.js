/**
 *      Kevinwkz - 2020/08/27
 */

const { Command, Server } = require('../..');
const { inspect } = require('util');
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
       
        const embed = new Discord.MessageEmbed().setTitle('Saída:');
        let evaled;

        /* Shortcut variables */
        const server = Server;
        const client = Bot.client;
        const api = Bot.api;
        const me = msg.author;
        const users = client.users;
        const members = client.members;

        try {
            evaled = await eval(args.join(' '));
            if (typeof evaled !== 'string') evaled = inspect(evaled);

            await msg.channel.send(
                embed
                    .setColor(0x2F3136)
                    .setDescription(`\`\`\`js\n${evaled}\n\`\`\``)
            );
        } catch(e) {
            evaled = e;
            embed.setColor(0xF44336);

            await msg.channel.send(
                embed.setDescription(`\`\`\`js\n${evaled}\n\`\`\``)
            );
        }

    }
}

module.exports = Eval;