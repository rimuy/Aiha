console.log('\x1b[35m');
require('dotenv').config();
require('moment-timezone').tz.setDefault('America/Sao_Paulo');
require('./server');
const { Bot } = require('./src/Aiha');

const bot = new Bot();
bot.client.login(process.env.TOKEN);