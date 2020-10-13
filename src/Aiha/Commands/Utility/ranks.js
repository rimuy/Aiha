/**
 *      Kevinwkz - 2020/09/05
 */

const { Internals, Server } = require('../..');

class Ranks extends Internals.Command {
    constructor() {
        super('ranks', {
            description: 'Retorna uma lista com todos os cargos de level disponíveis.',
            usage: 'ranks',
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS'],
            blockFlags: ['double'],
        });
    }

    async run(msg) {

        const error = msg.instance.emojis.get('name', 'bot2Cancel');
        const embed = new Internals.BaseEmbed();
        
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
        
        msg.target.send(embed);

    }
}

module.exports = Ranks;