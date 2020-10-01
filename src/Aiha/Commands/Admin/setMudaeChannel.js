/**
 *      Kevinwkz - 2020/09/16
 */

const { Internals, Server } = require('../..');

class SetMudaeChannel extends Internals.Command {
    constructor() {
        super('setMudaeChannel', {
            description: 'Define o canal de comandos que a Mudae é usada.',
            usage: 'setMudaeChannel `<canal>`',
            aliases: ['setmc', 'mudaeChannel'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
        });
    }

    async run(msg, args) {
        
        const id = (args[0] || '')
            .replace(/[<#>]/g, '');
       
        const bot = msg.instance;
        const embed = new Internals.BaseEmbed();
        const success = bot.emojis.get('bot2Success');
        const error = bot.emojis.get('bot2Cancel');

        const guild = await msg.guild.fetch();
        const channel = guild.channels.cache.get(id);

        if (channel) {

            await Server.Database.request('PATCH', 'settings', { mudaeChannel: channel.id })
                .then(res => {
                    embed
                        .setDescription(`${success} **O canal de comandos da Mudae foi setado para** <#${res.mudaeChannel}>**!**`);
                })
                .catch(err => {
                    console.log(err);

                    embed
                        .setDescription(`${error} **Ocorreu um erro ao tentar registrar o canal.**`)
                        .setColor(0xF44336);
                });
        } else {
            embed
                .setDescription(`${error} **O Canal não foi encontrado.**`)
                .setColor(0xF44336);
        }

        msg.channel.send(embed);
    }
}

module.exports = SetMudaeChannel;