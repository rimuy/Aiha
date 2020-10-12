const Module = require('../Internals/Structures/Module');
const Server = require('../Server');

module.exports = new class extends Module
{
    async function(guild, content) 
    {
        if (!guild) return;
        
        const id = (await Server.Database.request('GET', 'settings')).logChannel;
        const logChannel = guild.channels.cache.get(id);
        
        if (!logChannel) return;
        
        await logChannel.send(content).catch(console.log);
    }
};