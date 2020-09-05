const { readdirSync } = require('fs');
const path = require('path').join(__dirname, '..', 'events/');

const eventsDir = readdirSync(path);

module.exports = Bot => {
    const files = eventsDir.filter(f => f.endsWith('.js'));

    files.forEach(f => {

        const exports = require(path + f);
        const event = new exports();
        
        try {
            Bot.events.set(event.name, event);
            Bot.client.on(event.name, (...args) => event.run(Bot, ...args));
        } catch(e) {
            console.log(e.message);
        }
        
    })

}