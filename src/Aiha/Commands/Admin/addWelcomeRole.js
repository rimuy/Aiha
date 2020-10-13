/**
 *      Kevinwkz - 2020/09/11
 */

const { Internals, Server } = require('../..');
const { MessageEmbed } = require('discord.js');
const { color } = require('./.config.json');

class AddWelcomeRole extends Internals.Command {
    constructor() {
        super('addWelcomeRole', {
            description: 'Adiciona o cargo citado à lista de cargos de bem-vindo.',
            usage: 'addWelcomeRole `<cargo>`',
            aliases: ['addwr', 'welcomerole'],
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
        const success = bot.emojis.get('name', 'bot2Success');
        const error = bot.emojis.get('name', 'bot2Cancel');
        const exclamation = bot.emojis.get('name', 'bot2Exclamation');

        if (!role) {
            return msg.target.send(
                new MessageEmbed()
                    .setDescription(`${exclamation} **Cargo inválido.**`)
                    .setColor(0xe3c51b)
            );
        }
        
        const embed = new Internals.BaseEmbed().setColor(color);
        const welcomeRoles = (await Server.Database.request('GET', 'settings')).welcomeRoles || [];
        welcomeRoles.push(role.id);

        await Server.Database.request('PATCH', 'settings', { welcomeRoles })
            .then(() => {
                embed.setDescription(`${success} **Cargo de bem-vindo \`${role.name}\` foi adicionado à lista.**`);
            })
            .catch(() => {
                embed
                    .setDescription(`${error} **Ocorreu um erro ao tentar registrar o cargo.**`)
                    .setColor(0xF44336);
            });
        
        msg.target.send(embed);
    }
}

module.exports = AddWelcomeRole;