const BaseEmbed = require('../Internals/Structures/BaseEmbed');
const Logs = require('./Logs');

const users = new Map();
const maxMessages = 4;
const spamInterval = 650;

let timeout;

module.exports = async message => {
    
    let spammed;
    const user = message.author;
    const id = user.id;

    !users.has(id)
        && users.set(id, new Set());

    const messages = users.get(id);
    messages.add(message.id);

    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => messages.clear(), spamInterval);

    if (messages.size >= maxMessages) {
        const collected = [...messages.values()];

        collected.forEach(async messageId => {
            await message.channel.messages.delete(messageId, 'spam')
                .catch(() => false);
        });

        spammed = true;
        clearTimeout(timeout);
        messages.clear();

        Logs(false, message.channel,
            new BaseEmbed()
                .setAuthor('Spam Detectado', user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Usuário', value: `<@${user.id}>`, inline: true },
                    { name: 'Quantidade', value: `\`${collected.length}\``, inline: true },
                    { name: 'Canal', value: `<#${message.channel.id}>` },
                )
                .setFooter(`ID: ${user.id}`)
        );
    }

    return spammed;
};