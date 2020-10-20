/**
 *      Kevinwkz - 2020/09/02
 */

const { Internals, Server, Modules } = require('../..');
const { color } = require('./.config.json');

class RemoveWarn extends Internals.Command {
    constructor() {
        super('removewarn', {
            description: 'Limpa todos as infrações registradas do membro citado.',
            usage: 'removewarn `<#númeroDoCaso>`',
            aliases: ['rw'],
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES'],
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {

        const bot = msg.instance;
        const warnCase = parseInt((args[0] || '#0').replace(/#/g, ''));
        const embed = new Internals.BaseEmbed().setColor(color);

        const success = bot.emojis.get('name', 'bot2Success');
        const error = bot.emojis.get('name', 'bot2Cancel');
        const exclamation = bot.emojis.get('name', 'bot2Exclamation');

        if (warnCase) {
            const infration = await Server.Database.request('GET', `infractions/${warnCase}`);

            if (infration) {
                await Server.Database.request('DELETE', `infractions/${warnCase}`)
                    .then(async () => {
                        embed.setDescription(`${success} **O Caso #${warnCase} foi removido com sucesso.**`);

                        const logEmbed = new Internals.BaseEmbed()
                            .setTitle('Infração Removida')
                            .addFields(
                                { name: 'Moderador', value: `<@${msg.author.id}>`, inline: true },
                                { name: 'Caso', value: `\`${warnCase}\``, inline: true },
                            );
    
                        await Modules.ModLogs.run(msg.guild, logEmbed);
                    })
                    .catch(() => {
                        embed
                            .setDescription(`${error} **Ocorreu um erro ao tentar remover a infração.**`)
                            .setColor(0xF44336);
                    });

            } else {
                embed
                    .setDescription(`${exclamation} **O Caso #${warnCase} não foi encontrado.**`)
                    .setColor(0xe3c51b);
            }

        }
        
        msg.target.send(embed);
    }
}

module.exports = RemoveWarn;