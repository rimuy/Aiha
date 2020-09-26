const { Structures } = require('discord.js');

module.exports = Bot => 
    Structures.extend('Guild', Guild => {
        class ExtendedGuild extends Guild {
            constructor(client, data) {
                super(client, data);
                this.Instance = Bot;
            }
        }
    
        return ExtendedGuild;
    });