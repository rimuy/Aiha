/**
 *      Kevinwkz - 2020/08/27
 */

const { Command } = require('../..');
const { MessageEmbed } = require('discord.js');

class Purge extends Command {
    constructor() {
        super('purge', {
            description: 'Limpa o histórico do canal.',
            usage: 'purge `[quantidade]`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES']
        });
    }

    run(Bot, msg, args) {

        const max = 100;
        const embed = new MessageEmbed()
        const num = parseInt(args[0] || toString(max));

        msg.channel.bulkDelete(num < max ? num + 1 : max)
            .then(msgs => {
                embed
                  .setDescription(`🗑️ **Foram deletadas** \`${msgs.size - 1}\` **mensagens!**`)
                  .setColor(0x1ba4e3);
            })
            .catch(() => {
                embed
                  .setDescription('❌ Ocorreu um erro ao tentar realizar este comando.')
                  .setColor(0xF44336);
            })
            .finally(() => msg.channel.send(embed));
        
    }
}

module.exports = Purge;