/**
 *      Kevinwkz - 2020/09/11
 */

const { Internals, Server } = require('../..');
const { MessageEmbed } = require('discord.js');

class RemoveWelcomeRole extends Internals.Command {
    constructor() {
        super('removeWelcomeRole', {
            description: 'Remove o cargo da lista de cargos de bem-vindo.',
            usage: 'removeWelcomeRole `<cargo>`',
            aliases: ['rmwr', 'rmwelcomerole'],
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
        });
    }

    async run(Bot, msg, args) {
        
        const id = (args[0] || '')
            .replace(/[<@!>&]/g, '');

        const role = await msg.guild.roles.fetch(id);
        const success = Bot.emojis.get('bot2Success');
        const error = Bot.emojis.get('bot2Cancel');
        const exclamation = Bot.emojis.get('bot2Exclamation');

        if (!role) {
            return msg.channel.send(
                new MessageEmbed()
                    .setDescription(`${exclamation} **Cargo inválido.**`)
                    .setColor(0xe3c51b)
            );
        }

        const embed = new Internals.BaseEmbed();
        const welcomeRoles = (await Server.Database.request('GET', 'settings')).welcomeRoles || [];

        const index = welcomeRoles.indexOf(role.id);
        index > -1 ? welcomeRoles.splice(index, 1) : false;

        await Server.Database.request('PATCH', 'settings', { welcomeRoles })
            .then(() => {
                embed.setDescription(`${success} **Cargo de bem-vindo \`${role.name}\` foi removido da lista.**`);
            })
            .catch(() => {
                embed
                    .setDescription(`${error} **Ocorreu um erro ao tentar remover o cargo.**`)
                    .setColor(0xF44336);
            });
        
        msg.channel.send(embed);
    }
}

module.exports = RemoveWelcomeRole;