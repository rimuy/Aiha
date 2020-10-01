const { Structures } = require('discord.js');

module.exports = Bot => 
    Structures.extend('Message', Message => {
        class AihaMessage extends Message {
            constructor(client, data, channel) {
                super(client, data, channel);
                this.instance = Bot;
            }
        }
    
        return AihaMessage;
    });