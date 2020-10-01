const Server = require('../Server');

module.exports = async (guild, content) => {

    const id = (await Server.Database.request('GET', 'settings')).modlogChannel;
    const modlogChannel = guild.channels.cache.get(id);

    if (!modlogChannel) return;

    await modlogChannel.send(content).catch(console.log);
};