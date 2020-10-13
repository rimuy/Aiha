/**
 *      Kevinwkz - 2020/09/05
 */

const { Internals, Server } = require('../..');
const { MessageEmbed } = require('discord.js');
const { color } = require('./.config.json');

class SetRank extends Internals.Command {
    constructor() {
        super('setrank', {
            description: 'Define o level requerido para ganhar o cargo.',
            usage: 'setrank `<cargo>` `<level>`',
            aliases: ['setr'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {
        
        const id = (args[0] || '')
            .replace(/[<@!>&]/g, '');

        const reqLevel = args[1];

        const bot = msg.instance;
        const role = await msg.guild.roles.fetch(id);

        if (!role) {
            return msg.target.send(
                new MessageEmbed()
                    .setDescription(`${bot.emojis.get('name', 'bot2Exclamation')} **Cargo inválido.**`)
                    .setColor(0xe3c51b)
            );
        }
        else if (!reqLevel || !parseInt(reqLevel)) {
            return msg.target.send(
                new MessageEmbed()
                    .setDescription(`${bot.emojis.get('name', 'bot2Exclamation')} **É preciso definir um level acima de 1.**`)
                    .setColor(0xe3c51b)
            );
        }

        const embed = new Internals.BaseEmbed().setColor(color);

        await Server.Database.request('POST', `levelroles/${id}`, {
            roleId: id,
            requiredLevel: parseInt(reqLevel),
        })
            .then(res => {
                embed.setDescription(`${bot.emojis.get('name', 'bot2Success')} **Cargo \`${role.name}\` foi adicionado com o level requerido de ${res[id].requiredLevel}.**`);
            })
            .catch(() => {
                embed
                    .setDescription(`${bot.emojis.get('name', 'bot2Cancel')} **Ocorreu um erro ao tentar registrar o cargo.**`)
                    .setColor(0xF44336);
            });
        
        msg.target.send(embed);
    }
}

module.exports = SetRank;