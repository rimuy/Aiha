const { Structures } = require('discord.js');

module.exports = Bot => 
    Structures.extend('Guild', Guild => {
        class AihaGuild extends Guild {
            constructor(client, data) {
                super(client, data);
                this.instance = Bot;
            }
        }
    
        return AihaGuild;
    });