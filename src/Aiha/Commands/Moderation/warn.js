/**
 *      Kevinwkz - 2020/09/02
 */

const { Internals, Modules, Server } = require('../..');

class Warn extends Internals.Command {
    constructor() {
        super('warn', {
            description: 'Registra uma infração aos usuários marcados.',
            usage: 'warn `<@membro> `<motivo>`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES'],
        });
    }

    run(msg, args) {
        
        const bot = msg.instance;
        const id = (args[0] || '').replace(/[<@!>&]/g, '');
        const embed = new Internals.BaseEmbed();

        const success = bot.emojis.get('bot2Success');
        const error = bot.emojis.get('bot2Cancel');
        const exclamation = bot.emojis.get('bot2Exclamation');

        if (!id.length) {
            return msg.target.send(
                embed
                    .setDescription(`${exclamation} **Mencione o usuário que deseja registrar a infração.**`)
                    .setColor(0xe3c51b)
            );
        }
        
        const infration = args.slice(1).join(' ') || 'Nenhum motivo foi registrado.';

        msg.guild.members.fetch(id)
            .then(member => {

                Server.Database.request('POST', 'infrations', {
                    userId: id,
                    moderatorId: msg.author.id,
                    description: infration,
                    createdTimestamp: new Date(),
                })
                    .then(async inf => {

                        await msg.target.send(
                            embed
                                .setDescription(`${success} **Foi registrada uma infração para ${member.user.tag}.**`)
                        );
    
                        const logEmbed = new Internals.BaseEmbed()
                            .setTitle('Infração Registrada')
                            .addFields(
                                { name: 'Usuário', value: `<@${member.id}>`, inline: true },
                                { name: 'Moderador', value: `<@${msg.author.id}>`, inline: true },
                                { name: 'Caso', value: `\`${inf._case}\``, inline: true },
                                { name: 'Motivo', value: `\`${infration}\``, inline: true },
                            );
    
                        Modules.ModLogs.run(msg.guild, logEmbed);

                    })
                    .catch(() => {
                        msg.target.send(
                            embed
                                .setDescription(`${error} **Ocorreu um erro ao tentar registrar a infração.**`)
                                .setColor(0xF44336)
                        );
                    });

            })
            .catch(() => {
                msg.target.send(
                    embed
                        .setDescription(`${error} **Usuário não encontrado.**`)
                        .setColor(0xF44336)
                );
            });

    }
}

module.exports = Warn;