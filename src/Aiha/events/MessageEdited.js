/**
 *      Kevinwkz - 2020/09/09
 */

const { Event, BaseEmbed } = require('..');
const Logs = require('../lib/Logs');

class MessageEditedEvent extends Event {
    constructor() {
        super({
            event: 'messageUpdate',
            callback: (Bot, oldMsg, newMsg) => {

                if (!oldMsg.content) return;
                
                const embed = new BaseEmbed()
                    .setAuthor('Mensagem Editada', newMsg.author.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Usuário', value: `<@${newMsg.author.id}>`, inline: true },
                        { name: 'Canal', value: `<#${newMsg.channel.id}>`, inline: true },
                        { name: 'Antiga', value: `\`\`\`\n${oldMsg.content}\n\`\`\`` },
                        { name: 'Nova', value: `\`\`\`\n${newMsg.content}\n\`\`\`` },
                    );

                Logs(Bot, newMsg.channel, embed);
            }
        });
    }
}

module.exports = MessageEditedEvent;