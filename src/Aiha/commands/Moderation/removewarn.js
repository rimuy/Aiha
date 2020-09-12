/**
 *      Kevinwkz - 2020/09/02
 */

const { Command, BaseEmbed, Server } = require('../..');

class RemoveWarn extends Command {
    constructor() {
        super('removewarn', {
            description: 'Limpa todos as infrações registradas do membro citado.',
            usage: 'removewarn `[@membro]` `<#númeroDoCaso>`',
            aliases: ['rw'],
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES'],
        });
    }

    async run(Bot, msg, args) {

        const id = (args[0] || msg.author.id)
            .replace(/[<@!>&]/g, '');

        const warnCase = parseInt((args[1] || '#0').match(/#(\d+)/)[1]);
        const embed = new BaseEmbed();

        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');
        
        if (!id.length) {
            return msg.channel.send(
                embed
                    .setDescription(`${exclamation} **Mencione o usuário que deseja retirar a infração.**`)
                    .setColor(0xe3c51b)
            );
        }

        if (warnCase) {
            const infrations = await Server.Database.request('GET', `infrations/${id}`);
            const infration = infrations.find(inf => inf.case === warnCase);

            if (infration) {
                await Server.Database.request('DELETE', `infrations/${id}/${warnCase}`)
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