/**
 *      Kevinwkz - 2020/09/05
 */

const { Internals, Server } = require('../..');
const { MessageEmbed } = require('discord.js');
const { color } = require('./.config.json');

class UnsetRank extends Internals.Command {
    constructor() {
        super('unsetrank', {
            description: 'Retira o cargo de level citado.',
            usage: 'unsetrank `<cargo>`',
            aliases: ['unsetr'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {

        const id = (args[0] || '')
            .replace(/[<@!>&]/g, '');
        
        const bot = msg.instance;
        const role = await msg.guild.roles.fetch(id);

        if (!role) {
            return msg.target.send(
                new MessageEmbed()
                    .setDescription(`${bot.emojis.get('name', 'bot2Exclamation')} **Cargo inválido.**`)
                    .setColor(0xe3c51b)
            );
        }

        const embed = new Internals.BaseEmbed().setColor(color);

        await Server.Database.request('DELETE', `levelroles/${id}`)
            .then(() => {
                embed.setDescription(`${bot.emojis.get('name', 'bot2Success')} **O Cargo \`${role.name}\` foi retirado do sistema de level.**`);
            })
            .catch(() => {
                embed
                    .setDescription(`${bot.emojis.get('name', 'bot2Cancel')} **Erro ao tentar remover o cargo do sistema.**`)
                    .setColor(0xF44336);
            });

        msg.target.send(embed);

    }
}

module.exports = UnsetRank;