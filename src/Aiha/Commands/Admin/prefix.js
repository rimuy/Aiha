/**
 *      Kevinwkz - 2020/09/07
 */

const { Internals, Server } = require('../..');

class Prefix extends Internals.Command {
    constructor() {
        super('prefix', {
            description: 'Altera o prefixo dos comandos do bot.',
            usage: 'prefix `<prefixo>`',
            aliases: [],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {
        
        const bot = msg.instance;
        const prefix = args[0];
       
        const embed = new Internals.BaseEmbed();
        const success = bot.emojis.get('bot2Success');
        const error = bot.emojis.get('bot2Cancel');
        const exclamation = bot.emojis.get('bot2Exclamation');

        if (prefix) {
            await Server.Database.request('PATCH', 'settings', { prefix })
                .then(res => {
                    embed.setDescription(`${success} **O prefixo dos comandos foi alterado para** \`${res.prefix}\`**.**`);
                    bot.updateStatus();
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
        
        msg.target.send(embed);
    }
}

module.exports = Prefix;