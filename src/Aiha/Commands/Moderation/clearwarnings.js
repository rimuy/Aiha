/**
 *      Kevinwkz - 2020/09/02
 */

const { Internals, Server } = require('../..');
const { color } = require('./.config.json');

class ClearWarnings extends Internals.Command {
    constructor() {
        super('clearwarnings', {
            description: 'Limpa todos as infrações registradas do membro citado.',
            usage: 'clearwarnings `[@membro]',
            aliases: ['cw'],
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES'],
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {

        const id = (args[0] || msg.author.id)
            .replace(/[<@!>&]/g, '');

        const bot = msg.instance;
        const embed = new Internals.BaseEmbed().setColor(color);
        const response = await Server.Database.request('PURGE', `infrations/${id}`);

        const success = bot.emojis.get('bot2Success');
        const error = bot.emojis.get('bot2Cancel');

        if (response) {
            embed
                .setDescription(`${success} **As infrações do usuário foram limpas com sucesso.**`);
        } else {
            embed
                .setDescription(`${error} **Erro na tentativa de deletar as infrações do usuário.**`)
                .setColor(0xF44336);
        }

        msg.target.send(embed);

    }
}

module.exports = ClearWarnings;