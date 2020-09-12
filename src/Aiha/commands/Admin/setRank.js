/**
 *      Kevinwkz - 2020/09/05
 */

const { Command, BaseEmbed, Server } = require('../..');
const { MessageEmbed } = require('discord.js');

class SetRank extends Command {
    constructor() {
        super('setrank', {
            description: 'Define o level requerido para ganhar o cargo.',
            usage: 'setrank `<cargo>` `<level>`',
            aliases: ['setr'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
        });
    }

    async run(Bot, msg, args) {
        
        const id = (args[0] || '')
            .replace(/[<@!>&]/g, '');

        const reqLevel = args[1];

        const role = await msg.guild.roles.fetch(id);

        if (!role) {
            return msg.channel.send(
                new MessageEmbed()
                    .setDescription(`${Bot.emojis.get('bot2Exclamation')} **Cargo inválido.**`)
                    .setColor(0xe3c51b)
            );
        }
        else if (!reqLevel || !parseInt(reqLevel)) {
            return msg.channel.send(
                new MessageEmbed()
                    .setDescription(`${Bot.emojis.get('bot2Exclamation')} **É preciso definir um level acima de 1.**`)
                    .setColor(0xe3c51b)
            );
        }

        const embed = new BaseEmbed();

        await Server.Database.request('POST', `levelroles/${id}`, {
            roleId: id,
            requiredLevel: parseInt(reqLevel),
        })
            .then(res => {
                embed.setDescription(`${Bot.emojis.get('bot2Success')} **Cargo \`${role.name}\` foi adicionado com o level requerido de ${res[id].requiredLevel}.**`);
            })
            .catch(() => {
                embed
                    .setDescription(`${Bot.emojis.get('bot2Cancel')} **Ocorreu um erro ao tentar registrar o cargo.**`)
                    .setColor(0xF44336);
            });
        
        msg.channel.send(embed);
    }
}

module.exports = SetRank;