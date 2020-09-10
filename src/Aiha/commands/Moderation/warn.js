/**
 *      Kevinwkz - 2020/08/02
 */

const { Command, BaseEmbed } = require('../..');
const Logs = require('../../lib/Logs');

class Warn extends Command {
    constructor() {
        super('warn', {
            description: 'Registra uma infração aos usuários marcados.',
            usage: 'warn `<@membro> `<motivo>`',
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES'],
        });
    }

    run(Bot, msg, args) {
        
        const id = (args[0] || '').replace(/[<@!>&]/g, '');
        const embed = new BaseEmbed();

        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

        if (!id.length) {
            return msg.channel.send(
                    embed
                        .setDescription(`${exclamation} **Mencione o usuário que deseja registrar a infração.**`)
                        .setColor(0xe3c51b)
            );
        }
        
        const infration = args[1] || 'Nenhum motivo foi registrado.';

        msg.guild.members.fetch(id)
            .then(member => {

                Bot.server.request('POST', `infrations/${id}`, {
                    description: infration,
                    createdTimestamp: new Date(),
                })
                .then(async inf => {

                    await msg.channel.send(
                        embed
                            .setDescription(`${success} **Foi registrada uma infração para ${member.user.tag}.**`)
                    );
    
                    const logEmbed = new BaseEmbed()
                        .setTitle('Infração Registrada')
                        .addFields(
                            { name: 'Usuário', value: `<@${member.id}>`, inline: true },
                            { name: 'Motivo', value: `\`${infration}\``, inline: true },
                            { name: 'Caso', value: `\`${inf.case}\`` },
                        );
    
                    Logs(Bot, msg.channel, logEmbed);

                })
                .catch(() => {
                    msg.channel.send(
                        embed
                            .setDescription(`${error} **Ocorreu um erro ao tentar registrar a infração.**`)
                            .setColor(0xF44336)
                    );
                });

            })
            .catch(() => {
                msg.channel.send(
                    embed
                        .setDescription(`${error} **Usuário não encontrado.**`)
                        .setColor(0xF44336)
                );
            });

    }
}

module.exports = Warn;