const { Server } = require('..');

var fetched;

module.exports = async (Bot, channel, content) => {

    if (!fetched) {
        await channel.guild.fetch();
        fetched = true;
    }

    const id = (await Server.Database.request('GET', 'settings')).logChannel;
    const logChannel = channel.guild.channels.cache.get(id);

    if (!logChannel) return;

    await logChannel.send(content).catch(console.log);
};