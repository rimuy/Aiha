/**
 *      Kevinwkz - 2020/08/02
 */

const { Command, BaseEmbed } = require('../..');

class ClearWarnings extends Command {
    constructor() {
        super('clearwarnings', {
            description: 'Limpa todos as infrações registradas do membro citado.',
            usage: 'clearwarnings `[@membro]',
            aliases: ['cw'],
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES'],
        });
    }

    async run(Bot, msg, args) {

        const id = (args[0] || msg.author.id)
            .replace(/[<@!>&]/g, '');

        const embed = new BaseEmbed();
        const response = await Bot.server.request('DELETE', `infrations/${id}`);

        if (response) {
            embed
                .setDescription(`${Bot.emojis.get('bot2Success')} **As infrações do usuários foram limpas com sucesso.**`);
        } else {
            embed
                .setDescription(`${Bot.emojis.get('bot2Cancel')} **Erro na tentativa de deletar as infrações do usuário.**`)
                .setColor(0xF44336);
        }

        msg.channel.send(embed);

    }
}

module.exports = ClearWarnings;