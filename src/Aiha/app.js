require('dotenv').config();
require('moment-timezone').tz.setDefault('America/Sao_Paulo');
const { Internals, Monitors } = require('.');
require('../../Server');

const bot = new Internals.Bot();

bot.client.login(
    process.argv[2] === 'dev' 
        ? process.env.TESTER 
        : process.env.TOKEN
)
    .then(() => {
        Monitors.MudaeObserver.Bot = bot;
        Monitors.MuteManager.Bot = bot;
    });