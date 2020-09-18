
module.exports = async message => {

    if (
        [
            'discord.gg',
        ].some(e => message.content.toLowerCase().includes(e))) {
        const success = await message.delete().then(async () => {
            await message.channel.send(`<@${message.author.id}> **Não é permitido divulgação!**`)
                .then(m => m.delete({ timeout: 3000 }));

            return true;
        }).catch();
        
        return success;
    }
};