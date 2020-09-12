/**
 *      Kevinwkz - 2020/09/07
 */

const { Command, BaseEmbed, Server } = require('../..');

class Prefix extends Command {
    constructor() {
        super('prefix', {
            description: 'Altera o prefixo dos comandos do bot.',
            usage: 'prefix `<prefixo>`',
            aliases: [],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
        });
    }

    async run(Bot, msg, args) {
        
        const prefix = args[0];
       
        const embed = new BaseEmbed();
        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

        if (prefix) {
            await Server.Database.request('PATCH', 'settings', { prefix })
                .then(res => {
                    embed.setDescription(`${success} **O prefixo dos comandos foi alterado para** \`${res.prefix}\`**.**`);
                    Bot.updateStatus();
                })
                .catch(() => {
                    embed
                        .setDescription(`${error} **Ocorreu um erro ao tentar definir o prefixo dos comandos.**`)
                        .setColor(0xF44336);
                });
        } else {
            embed
                .setDescription(`${exclamation} **É preciso definir um prefixo.**`)
                .setColor(0xe3c51b);
        }
        
        msg.channel.send(embed);
    }
}

module.exports = Prefix;