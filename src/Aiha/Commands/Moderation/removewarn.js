/**
 *      Kevinwkz - 2020/09/02
 */

const { Internals, Server } = require('../..');

class RemoveWarn extends Internals.Command {
    constructor() {
        super('removewarn', {
            description: 'Limpa todos as infrações registradas do membro citado.',
            usage: 'removewarn `<#númeroDoCaso>`',
            aliases: ['rw'],
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES'],
        });
    }

    async run(Bot, msg, args) {

        const warnCase = parseInt((args[0] || '#0').replace(/#/g, ''));
        const embed = new Internals.BaseEmbed();

        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

        if (warnCase) {
            const infration = await Server.Database.request('GET', `infrations/${warnCase}`);

            if (infration) {
                await Server.Database.request('DELETE', `infrations/${warnCase}`)
                    .then(() => {
                        embed.setDescription(`${success} **O Caso #${warnCase} foi removido com sucesso.**`);
                    })
                    .catch(() => {
                        embed
                            .setDescription(`${error} **Ocorreu um erro ao tentar remover a infração.**`)
                            .setColor(0xF44336);
                    });

            } else {
                embed
                    .setDescription(`${exclamation} **O Caso #${warnCase} não foi encontrado.**`)
                    .setColor(0xe3c51b);
            }

        }
        
        msg.channel.send(embed);
    }
}

module.exports = RemoveWarn;