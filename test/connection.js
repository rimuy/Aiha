require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client({
    fetchAllMembers: true,
    ws: { intents: Intents.ALL },
    partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
});

client.on('ready', () => console.log('Ready!'));

client.login(process.env.TESTER);