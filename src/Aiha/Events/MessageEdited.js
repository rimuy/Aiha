/**
 *      Kevinwkz - 2020/09/09
 */

const { Modules, Internals } = require('..');

class MessageEditedEvent extends Internals.Event {
    constructor() {
        super({
            event: 'messageUpdate',
            callback: (oldMsg, newMsg) => {

                if (!oldMsg.content || oldMsg.content === newMsg.content) return;
                
                const embed = new Internals.BaseEmbed()
                    .setAuthor('Mensagem Editada', newMsg.author.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Usuário', value: `<@${newMsg.author.id}>`, inline: true },
                        { name: 'Canal', value: `<#${newMsg.channel.id}>`, inline: true },
                        { name: 'Antiga', value: `\`\`\`\n${oldMsg.content}\n\`\`\`` },
                        { name: 'Nova', value: `\`\`\`\n${newMsg.content}\n\`\`\`` },
                    );

                Modules.Logs(newMsg.guild, embed);
            }
        });
    }
}

module.exports = MessageEditedEvent;