/**
 *      Kevinwkz - 2020/09/09
 */

const { Event, BaseEmbed } = require('..');
const { Util } = require('discord.js');
const Logs = require('../lib/Logs');

const userMessages = new Map();

class MessageDeleteEvent extends Event {
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
                collected.clear();

                if (size > 1) return;
                
                const embed = new BaseEmbed()
                    .setAuthor('Mensagem Deletada', msg.author.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Usuário', value: `<@${msg.author.id}>`, inline: true },
                        { name: 'Canal', value: `<#${msg.channel.id}>`, inline: true },
                        { name: 'Conteúdo', value: `\`\`\`\n${msg.content}\n\`\`\`` },
                    );

                Logs(Bot, msg.channel, embed);
            }
        });
    }
}

module.exports = MessageDeleteEvent;