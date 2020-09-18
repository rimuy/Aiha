const users = new Map();
const maxMessages = 3;
const spamInterval = 1000;

let timeout;

module.exports = async message => {
    
    let spammed;
    const id = message.author.id;

    !users.has(id)
        && users.set(id, new Set());

    const messages = users.get(id);
    messages.add(message.id);

    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => messages.clear(), spamInterval);

    if (messages.size >= maxMessages) {
        await message.channel.bulkDelete(messages.size)
            .then(() => {
                spammed = true;
                clearTimeout(timeout);
                messages.clear();
            })
            .catch();
    }

    return spammed;
};