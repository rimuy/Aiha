const { readdirSync } = require('fs');
const path = require('path').join(__dirname, '..', 'src', 'Aiha', 'Events/');
const { Internals } = require('../src/Aiha');

const eventsDir = readdirSync(path);

class EventListener {
    constructor(bot) {
        const files = eventsDir.filter(f => f.endsWith('.js'));

        files.forEach(f => {
            
            try {
                const exports = require(path + f);
                const event = new exports();

                bot.client.on(event.name, event.run);
                bot.events.set(event.name, event);
            } catch(e) {
                Internals.Log('FG_RED', `[${f}] ` + e.message);
            }
            
        });
    }
}

module.exports = EventListener;