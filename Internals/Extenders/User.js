const { Structures } = require('discord.js');

module.exports = Bot => 
    Structures.extend('User', User => {
        class AihaUser extends User {
            constructor(client, data) {
                super(client, data);
                this.Instance = Bot;
            }

            get mention() {
                return `<@${this.id}>`;
            }
        }
    
        return AihaUser;
    });