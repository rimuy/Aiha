/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals } = require('../..');
const { MessageEmbed } = require('discord.js');

class SoftBan extends Internals.Command {
    constructor() {
        super('softban', {
            description: 'Executa os comandos de banimento e desbanimento nos membros citados, apagando suas mensagens recentes.',
            usage: 'softban `<@membro>`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['BAN_MEMBERS'],
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args, flags) {

        const bot = msg.instance;
        await bot.commands.get('ban').run(msg, args, flags, true);
        await bot.commands.get('unban').run(msg, args, flags, true);

        const embed = new MessageEmbed()
            .setDescription('☑️ **Comando executado.**')
            .setColor(0x1ba4e3);

        msg.target.send(embed);
        
    }
}

module.exports = SoftBan;