/**
 *      Kevinwkz - 2020/09/09
 */

const { Internals, Modules } = require('..');
const { Util } = require('discord.js');

const userMessages = new Map();

class MessageDeleteEvent extends Internals.Event {
    constructor() {
        super({
            event: 'messageDelete',
            callback: async (Bot, msg) => {

                if (!msg.content) return;

                const user = msg.author;

                !userMessages.has(user.id)
                    && userMessages.set(user.id, new Set());

                const collected = userMessages.get(user.id);
                collected.add(msg.id);

                await Util.delayFor(900);

                const size = collected.size;
                setTimeout(() => collected.clear(), 1100);

                if (size > 1) return;
                
                const embed = new Internals.BaseEmbed()
                    .setAuthor('Mensagem Deletada', msg.author.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Usuário', value: `<@${msg.author.id}>`, inline: true },
                        { name: 'Canal', value: `<#${msg.channel.id}>`, inline: true },
                        { name: 'Conteúdo', value: `\`\`\`\n${msg.content}\n\`\`\`` },
                    );

                Modules.Logs(msg.guild, embed);
            }
        });
    }
}

module.exports = MessageDeleteEvent;