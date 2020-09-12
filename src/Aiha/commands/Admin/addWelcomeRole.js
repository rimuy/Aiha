/**
 *      Kevinwkz - 2020/09/11
 */

const { Command, BaseEmbed } = require('../..');
const { MessageEmbed } = require('discord.js');

class AddWelcomeRole extends Command {
    constructor() {
        super('addWelcomeRole', {
            description: 'Adiciona o cargo citado à lista de cargos de bem-vindo.',
            usage: 'addWelcomeRole `<cargo>`',
            aliases: ['addwr', 'welcomerole'],
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

        const embed = new BaseEmbed();
        const welcomeRoles = (await Bot.server.request('GET', 'settings')).welcomeRoles || [];
        welcomeRoles.push(role.id);

        await Bot.server.request('PATCH', 'settings', { welcomeRoles })
            .then(() => {
                embed.setDescription(`${success} **Cargo de bem-vindo \`${role.name}\` foi adicionado à lista.**`);
            })
            .catch(() => {
                embed
                    .setDescription(`${error} **Ocorreu um erro ao tentar registrar o cargo.**`)
                    .setColor(0xF44336);
            });
        
        msg.channel.send(embed);
    }
}

module.exports = AddWelcomeRole;