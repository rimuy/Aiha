/**
 *      Kevinwkz - 2020/09/30
 */

const { Internals, Server } = require('../..');

class SetModLogChannel extends Internals.Command {
    constructor() {
        super('setModLogChannel', {
            description: 'Altera o canal de logs de moderação do bot.',
            usage: 'setModLogChannel `<canal>`',
            aliases: ['setmlc', 'modlogChannel'],
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

            await Server.Database.request('PATCH', 'settings', { modlogChannel: channel.id })
                .then(res => {
                    embed
                        .setDescription(`${success} **O canal de modlogs foi setado para** <#${res.modlogChannel}>**!**`);
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

module.exports = SetModLogChannel;