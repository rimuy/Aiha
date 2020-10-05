const Module = require('../Internals/Structures/Module');
const Server = require('../Server');

module.exports = new class extends Module
{
    async function(guild, content) 
    {
        const id = (await Server.Database.request('GET', 'settings')).modlogChannel;
        const modlogChannel = guild.channels.cache.get(id);
        
        if (!modlogChannel) return;
        
        await modlogChannel.send(content).catch(console.log);
    }
};