const Server = require('../../../server');
const config = require('../config/json/MudaeObserver.json');

var bot;

const keyMap = new Map()
    .set('claims', new Set())
    .set('rolls', new Set());

class MudaeObserver {

    static setBot(obj) {
        bot = obj;
        return this;
    }

    get claimMembers() {
        return keyMap.get('claims');
    }

    get rollMembers() {
        return keyMap.get('rolls');
    }

}

Object.keys(config).forEach(key => {

    const timer = () => {
        const resetTime = (config[key].every - CurrentInterval(key)) * 1000;

        setTimeout(async () => {

            if (!bot) return;
    
            const channelId = (await Server.Database.request('GET', 'settings')).mudaeChannel;
            const channel = bot.client.channels.cache.get(channelId);
            const waiting = keyMap.get(key);
    
            if (channel && waiting.size) {
    
                await channel.send(`Os ${key} foram resetados! ${
                    [...waiting.values()].map(id => `<@${id}>`).join(' ')
                }`);
    
                waiting.clear();
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