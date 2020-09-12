/**
 *      Kevinwkz - 2020/09/02
 */

const { Command, BaseEmbed, Server } = require('../..');

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
        const response = await Server.Database.request('DELETE', `infrations/${id}`);

        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');

        if (response) {
            embed
                .setDescription(`${success} **As infrações do usuários foram limpas com sucesso.**`);
        } else {
            embed
                .setDescription(`${error} **Erro na tentativa de deletar as infrações do usuário.**`)
                .setColor(0xF44336);
        }

        msg.channel.send(embed);

    }
}

module.exports = ClearWarnings;