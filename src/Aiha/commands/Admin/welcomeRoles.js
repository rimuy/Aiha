/**
 *      Kevinwkz - 2020/09/11
 */

const { Command, BaseEmbed, Server } = require('../..');

class WelcomeRoles extends Command {
    constructor() {
        super('welcomeRoles', {
            description: 'Exibe a lista de cargos de bem-vindo.',
            usage: 'welcomeRoles',
            aliases: ['wrs'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
        });
    }

    async run(Bot, msg) {
        
        const welcomeRoles = (await Server.Database.request('GET', 'settings')).welcomeRoles || [];
        
        msg.channel.send(
            new BaseEmbed()
                .setTitle('Cargos de Bem-vindo')
                .setDescription(
                    welcomeRoles && welcomeRoles.length
                        ? welcomeRoles.map(id => `<@&${id}>`).join('\n')
                        : 'Nenhum cargo foi adicionado.'
                )
        );

    }
}

module.exports = WelcomeRoles;