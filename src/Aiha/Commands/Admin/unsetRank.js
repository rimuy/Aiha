/**
 *      Kevinwkz - 2020/09/05
 */

const { Internals, Server } = require('../..');
const { MessageEmbed } = require('discord.js');

class UnsetRank extends Internals.Command {
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

    async run(msg, args) {

        const id = (args[0] || '')
            .replace(/[<@!>&]/g, '');
        
        const bot = msg.instance;
        const role = await msg.guild.roles.fetch(id);

        if (!role) {
            return msg.channel.send(
                new MessageEmbed()
                    .setDescription(`${bot.emojis.get('bot2Exclamation')} **Cargo inválido.**`)
                    .setColor(0xe3c51b)
            );
        }

        const embed = new Internals.BaseEmbed();

        await Server.Database.request('DELETE', `levelroles/${id}`)
            .then(() => {
                embed.setDescription(`${bot.emojis.get('bot2Success')} **O Cargo \`${role.name}\` foi retirado do sistema de level.**`);
            })
            .catch(() => {
                embed
                    .setDescription(`${bot.emojis.get('bot2Cancel')} **Erro ao tentar remover o cargo do sistema.**`)
                    .setColor(0xF44336);
            });

        msg.channel.send(embed);

    }
}

module.exports = UnsetRank;