/**
 *      Kevinwkz - 2020/08/02
 */

const { Command, BaseEmbed } = require('../..');

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

    async run(Bot, msg, args) {
        
        const id = (args[0] || '').replace(/[<@!>&]/g, '');
        const embed = new BaseEmbed();

        if (!id.length) {
            return msg.channel.send(
                    embed
                        .setDescription(`${Bot.emojis.get('bot2Exclamation')} **Mencione o usuário que deseja registrar a infração.**`)
                        .setColor(0xe3c51b)
            );
        }
        
        const infration = args[1] || 'Nenhum motivo foi registrado.';

        await msg.guild.members.fetch(id)
            .then(async member => {

                await Bot.server.request('POST', `infrations/${id}`, {
                    description: infration,
                    createdTimestamp: new Date(),
                });

                msg.channel.send(
                    embed
                        .setDescription(`${Bot.emojis.get('bot2Success')} **Foi registrada uma infração para ${member.user.tag}.**`)
                );

            })
            .catch(() => {
                msg.channel.send(
                    embed
                        .setDescription(`${Bot.emojis.get('bot2Cancel')} **Usuário não encontrado.**`)
                        .setColor(0xF44336)
                );
            });

    }
}

module.exports = Warn;