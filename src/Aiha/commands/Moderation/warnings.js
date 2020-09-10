/**
 *      Kevinwkz - 2020/08/02
 */

const { Command, BaseEmbed } = require('../..');

class Warnings extends Command {
    constructor() {
        super('warnings', {
            description: 'Exibe todos as suas infrações ou as do usuário marcado.',
            usage: 'warnings `[@membro]`',
            aliases: ['infrations'],
            category: 'Moderação',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES']
        });
    }

    async run(Bot, msg, args) {

        const id = (args[0] || msg.author.id)
            .replace(/[<@!>&]/g, '');

        const infrations = (await Bot.server.request('GET', 'infrations'))[id];
        const embed = new BaseEmbed();
        const error = Bot.emojis.get('bot2Cancel');

        const member = await msg.guild.members.fetch(id || '').catch();

        if (!member) {
            return msg.channel.send(
                embed
                    .setDescription(`${error} **Usuário não encontrado.**`)
                    .setColor(0xF44336)
            );
        }

        if (!infrations || !infrations.length) {
            embed.setDescription(`👼 **${member.user.username} não possui nenhuma infração registrada.**`);
        } else {
            embed
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(infrations.map(w => `**Case #${w.case}** ${w.description}`).join('\n'));
        }
        
        msg.channel.send(embed);
        
    }
}

module.exports = Warnings;