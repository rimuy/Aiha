/**
 *      Kevinwkz - 2020/09/07
 */

const { Internals, Server } = require('../..');
const { color } = require('./.config.json');

class SetCommandsChannel extends Internals.Command {
    constructor() {
        super('setCommandsChannel', {
            description: 'Altera o canal de comandos do bot.',
            usage: 'setCommandsChannel `<canal>`',
            aliases: ['setcc', 'commandsChannel'],
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
        const embed = new Internals.BaseEmbed().setColor(color);
        const success = bot.emojis.get('bot2Success');
        const error = bot.emojis.get('bot2Cancel');

        const guild = await msg.guild.fetch();
        const channel = guild.channels.cache.get(id);

        if (channel) {

            await Server.Database.request('PATCH', 'settings', { commandsChannel: channel.id })
                .then(res => {
                    embed
                        .setDescription(`${success} **O canal de comandos foi setado para** <#${res.commandsChannel}>**!**`);
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

module.exports = SetCommandsChannel;