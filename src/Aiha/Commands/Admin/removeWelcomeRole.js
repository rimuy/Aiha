/**
 *      Kevinwkz - 2020/09/11
 */

const { Internals, Server } = require('../..');
const { MessageEmbed } = require('discord.js');
const { color } = require('./.config.json');

class RemoveWelcomeRole extends Internals.Command {
    constructor() {
        super('removeWelcomeRole', {
            description: 'Remove o cargo da lista de cargos de bem-vindo.',
            usage: 'removeWelcomeRole `<cargo>`',
            aliases: ['rmwr', 'rmwelcomerole'],
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
        const success = bot.emojis.get('bot2Success');
        const error = bot.emojis.get('bot2Cancel');
        const exclamation = bot.emojis.get('bot2Exclamation');

        if (!role) {
            return msg.target.send(
                new MessageEmbed()
                    .setDescription(`${exclamation} **Cargo inválido.**`)
                    .setColor(0xe3c51b)
            );
        }

        const embed = new Internals.BaseEmbed().setColor(color);
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
        
        msg.target.send(embed);
    }
}

module.exports = RemoveWelcomeRole;