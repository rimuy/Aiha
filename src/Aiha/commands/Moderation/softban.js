/**
 *      Kevinwkz - 2020/08/27
 */

const { Command } = require('../..');
const { MessageEmbed } = require('discord.js');

class SoftBan extends Command {
    constructor() {
        super('softban', {
            description: 'Executa os comandos de banimento e desbanimento nos membros citados, apagando suas mensagens recentes.',
            usage: 'softban `<@membro>`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['BAN_MEMBERS']
        });
    }

    async run(Bot, msg, args) {

        await Bot.commands.get('ban').run(Bot, msg, args, true);
        await Bot.commands.get('unban').run(Bot, msg, args, true);

        const embed = new MessageEmbed()
            .setDescription('☑️ **Comando executado.**')
            .setColor(0x1ba4e3);

        msg.channel.send(embed);
        
    }
}

module.exports = SoftBan;