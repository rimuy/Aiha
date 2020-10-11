/**
 *      Kevinwkz - 2020/09/09
 */

const { Internals, Server } = require('../..');

class SetTestingChannel extends Internals.Command {
    constructor() {
        super('setTestingChannel', {
            description: 'Altera o canal de teste do bot.',
            usage: 'setTestingChannel `<canal>`',
            aliases: ['settc', 'testingChannel'],
            category: 'Developer',
            botPerms: ['EMBED_LINKS'],
            blockFlags: ['double', 'twice'],
            dev: true,
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

            await Server.Database.request('PATCH', 'settings', { testingChannel: channel.id })
                .then(res => {
                    embed
                        .setDescription(`${success} **O canal de teste foi setado para** <#${res.testingChannel}>**!**`);
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

module.exports = SetTestingChannel;