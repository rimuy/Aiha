console.log('\x1b[35m');
require('dotenv').config();
require('moment-timezone').tz.setDefault('America/Sao_Paulo');
require('../../Server');
const { Internals, Monitors } = require('.');

const bot = new Internals.Bot();
bot.client.login(
    process.argv[2] === 'dev' 
        ? process.env.TESTER 
        : process.env.TOKEN
)
    .then(() => {
        Monitors.MudaeObserver.setBot(bot);
        Monitors.Muteds.Bot = bot;
    });