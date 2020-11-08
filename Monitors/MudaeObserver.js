const Server = require('../Server');
const config = require('../Configuration/json/MudaeObserver.json');

var bot;

class MudaeObserver {

    static get Bot() {
        return bot;
    }

    static set Bot(obj) {
        bot = obj;
    }

}

Object.keys(config).forEach(key => {

    const timer = () => {
        const resetTime = (config[key].every - CurrentInterval(key)) * 1000;

        setTimeout(async () => {

            if (!bot) return;
    
            const channelId = (await Server.Database.request('GET', 'settings')).mudaeChannel;
            const channel = bot.client.channels.cache.get(channelId);
            const data = await Server.Database.request('GET', 'mudae');
            const waiting = data[key];
    
            if (
                channel &&
                waiting.length &&
                (key === 'claims' || !waiting.some(id => data['claims'].includes(id)) ) // Don't mention twice
            ) {
    
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