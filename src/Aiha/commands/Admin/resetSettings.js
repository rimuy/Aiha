/**
 *      Kevinwkz - 2020/09/07
 */

const { Command, BaseEmbed, Server } = require('../..');

class ResetSettings extends Command {
    constructor() {
        super('resetSettings', {
            description: 'Reseta as configurações do servidor para o padrão.',
            usage: 'resetSettings',
            aliases: ['resetst'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
        });
    }

    async run(Bot, msg) {
       
        const embed = new BaseEmbed();
        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');

        await Server.Database.request('POST', 'settings')
            .then(() => {
                embed.setDescription(`${success} **As configurações do servidor foram resetadas para o padrão.**`);
            })
            .catch(() => {
                embed
                    .setDescription(`${error} **Ocorreu um erro ao tentar resetar as configurações do servidor.**`)
                    .setColor(0xF44336);
            });
        
        msg.channel.send(embed);
    }
}

module.exports = ResetSettings;