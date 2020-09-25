const Server = require('../Server');
const config = require('../Configuration/json/MudaeObserver.json');

var bot;

class MudaeObserver {

    static setBot(obj) {
        bot = obj;
        return this;
    }

}

Object.keys(config).forEach(key => {

    const timer = () => {
        const resetTime = (config[key].every - CurrentInterval(key)) * 1000;

        setTimeout(async () => {

            if (!bot) return;
    
            const channelId = (await Server.Database.request('GET', 'settings')).mudaeChannel;
            const channel = bot.client.channels.cache.get(channelId);
            const waiting = await Server.Database.request('GET', `mudae/${key}`);
    
            if (channel && waiting.length) {
    
                await channel.send(`Os **${key}** foram resetados! ${
                    waiting.map(id => `<@${id}>`).join(' ')
                }`);
    
                await Server.Database.request('PURGE', `mudae/${key}`);
            }

            timer();
    
        }, resetTime);
    };

    timer();

});

function CurrentInterval(key) {
    const timeOfTheDay = (Date.now() % 86400000) + (config[key].startTimestamp * 1000);
    return (timeOfTheDay / 1000) % config[key].every;
}

module.exports = MudaeObserver;