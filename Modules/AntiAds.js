const Module = require('../Internals/Structures/Module');

module.exports = new class extends Module 
{
    async function(message) 
    {
        if (!message.member.hasPermission('ADMINISTRATOR') 
            && message.content.match(/d\s*i\s*s\s*c\s*o\s*r\s*d\s*\.\s*g\s*g\s*\/\s*.+/gmi)) 
        {
            const success = await message.delete().then(async () => {
                await message.channel.send(`<@${message.author.id}> **Não é permitido divulgação!**`)
                    .then(m => m.delete({ timeout: 3000 }));

                return true;
            }).catch();
            
            return success;
        }
    }
};