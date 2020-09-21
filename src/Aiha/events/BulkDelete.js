/**
 *      Kevinwkz - 2020/09/09
 */

const { Event, BaseEmbed } = require('..');
const { MessageAttachment } = require('discord.js');
const moment = require('moment-timezone');
const Logs = require('../lib/Logs');

class MessageDeleteBulkEvent extends Event {
    constructor() {
        super({
            event: 'messageDeleteBulk',
            callback: async (Bot, msgs) => {
                
                const channel = msgs.first().channel;
                const embed = new BaseEmbed()
                    .setTitle('🗑️ Coleção de mensagens deletadas')
                    .addFields(
                        { name: 'Canal', value: `<#${channel.id}>`, inline: true },
                        { name: 'Quantidade', value: `\`${msgs.size}\``, inline: true },
                    );

                const buffer = new Buffer.from(
                    msgs.map(msg => 
                        `[${moment().format('YYYY-MM-DD HH:mm:ss')}] [@${msg.author.tag} | ${msg.author.id}] ${msg.content}`
                    ).join('\n'),
                    'utf8'
                );

                const attachment = new MessageAttachment(buffer, `${Date.now()}-${channel.id}-${channel.name}.log`);

                await Logs(Bot, channel, embed);
                Logs(Bot, channel, attachment);
            }
        });
    }
}

module.exports = MessageDeleteBulkEvent;