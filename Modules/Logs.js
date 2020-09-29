const Server = require('../Server');

module.exports = async (guild, content) => {

    const id = (await Server.Database.request('GET', 'settings')).logChannel;
    const logChannel = guild.channels.cache.get(id);

    if (!logChannel) return;

    await logChannel.send(content).catch(console.log);
};