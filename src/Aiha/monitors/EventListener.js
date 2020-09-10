const { readdirSync } = require('fs');
const path = require('path').join(__dirname, '..', 'events/');
const Log = require('../util/Log')

const eventsDir = readdirSync(path);

module.exports = Bot => {
    const files = eventsDir.filter(f => f.endsWith('.js'));

    files.forEach(f => {
        
        try {
            const exports = require(path + f);
            const event = new exports();

            Bot.client.on(event.name, (...args) => event.run(Bot, ...args));
            Bot.events.set(event.name, event);
        } catch(e) {
            Log('FG_RED', `[${f}] ` + e.message);
        }
        
    })

}