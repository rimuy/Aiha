/**
 *      Kevinwkz - 2020/08/05
 */

const { Command, BaseEmbed } = require('../..');

class UnsetRank extends Command {
    constructor() {
        super('unsetrank', {
            description: 'Retira o cargo de level citado.',
            usage: 'unsetrank `<cargo>`',
            aliases: ['unsetr'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
        });
    }

    async run(Bot, msg, args) {

        const id = (args[0] || '')
            .replace(/[<@!>&]/g, '');
        
        const role = await msg.guild.roles.fetch(id);

        if (!role) {
            return msg.channel.send(
                new MessageEmbed()
                    .setDescription(`${Bot.emojis.get('bot2Exclamation')} **Cargo inválido.**`)
                    .setColor(0xe3c51b)
            );
        }

        const embed = new BaseEmbed();

        await Bot.server.request('DELETE', `levelroles/${id}`)
            .then(() => {
                embed.setDescription(`${Bot.emojis.get('bot2Success')} **O Cargo \`${role.name}\` foi retirado do sistema de level.**`);
            })
            .catch(() => {
                embed
                    .setDescription(`${Bot.emojis.get('bot2Cancel')} **Erro ao tentar remover o cargo do sistema.**`)
                    .setColor(0xF44336);
            });

        msg.channel.send(embed);

    }
}

module.exports = UnsetRank;