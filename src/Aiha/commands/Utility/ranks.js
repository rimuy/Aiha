/**
 *      Kevinwkz - 2020/09/05
 */

const { Command, BaseEmbed, Server } = require('../..');

class Ranks extends Command {
    constructor() {
        super('ranks', {
            description: 'Retorna uma lista com todos os cargos de level disponíveis.',
            usage: 'ranks',
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(Bot, msg) {

        const error = Bot.emojis.get('bot2Cancel');
        const embed = new BaseEmbed();
        
        await Server.Database.request('GET', 'levelroles')
            .then(res => {
                embed
                    .setTitle('Sistema de Level')
                    .setDescription(`${
                        Object.keys(res)
                            .sort((a, b) => res[a].requiredLevel - res[b].requiredLevel)
                            .map(id => `<@&${id}> | Level ${res[id].requiredLevel}`)
                            .join('\n')
                    }`);
            })
            .catch(() => {
                embed
                    .setDescription(`${error} **Ocorreu um erro ao consultar a lista de cargos.**`)
                    .setColor(0xF44336);
            });
        
        msg.channel.send(embed);

    }
}

module.exports = Ranks;