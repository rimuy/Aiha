console.log('\x1b[35m');
require('dotenv').config();
require('moment-timezone').tz.setDefault('America/Sao_Paulo');
require('../../server');
const { Bot, MudaeObserver } = require('.');

const bot = new Bot();
bot.client.login(
    process.argv[2] === 'dev' 
        ? process.env.TESTER 
        : process.env.TOKEN
)
.then(() => MudaeObserver.setBot(bot));