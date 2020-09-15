/**
 *      Kevinwkz - 2020/09/02
 */

const { Command, BaseEmbed, PageEmbed, Server } = require('../..');
const moment = require('moment-timezone');

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

        const infrations = (await Server.Database.request('GET', 'infrations') || [])
            .filter(inf => inf.userId === id);

        const member = await msg.guild.members.fetch(id || '').catch(() => {});

        if (!infrations || !infrations.length) {
            msg.channel.send(
                new BaseEmbed()
                    .setDescription(`👼 **${member ? member.user.username : 'Este usuário'} não possui nenhuma infração registrada.**`)
            );
        } else {
            new PageEmbed(
                msg, 
                infrations.map(w => 
                    `> 📕 \`#${w._case}\`\n`+ 
                    `> **Moderador:** <@${w.moderatorId}>\n` + 
                    `> **Data de Registro:** ${moment(w.createdTimestamp).format('hh:mm DD/MM/YYYY')}\n` +
                    `> **Descrição:** ${w.description}\n\n`
                ), 
                7
            )
                .setAuthor(member ? member.user.tag : id, member ? member.user.displayAvatarURL({ dynamic: true }) : null)
                .send();
        }
        
    }
}

module.exports = Warnings;