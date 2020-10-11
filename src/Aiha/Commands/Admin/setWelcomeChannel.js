/**
 *      Kevinwkz - 2020/09/07
 */

const { Internals, Server } = require('../..');

class SetWelcomeChannel extends Internals.Command {
    constructor() {
        super('setWelcomeChannel', {
            description: 'Altera o canal de mensagens de bem-vindo.',
            usage: 'setWelcomeChannel `<canal>`',
            aliases: ['setwc', 'welcomeChannel'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
            blockFlags: ['double', 'twice'],
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

            await Server.Database.request('PATCH', 'settings', { welcomeChannel: channel.id })
                .then(res => {
                    embed
                        .setDescription(`${success} **O canal de mensagens de bem-vindo foi setado para** <#${res.welcomeChannel}>**!**`);
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

        msg.target.send(embed);
    }
}

module.exports = SetWelcomeChannel;