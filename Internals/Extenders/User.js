const { Structures } = require('discord.js');

module.exports = Bot => 
    Structures.extend('User', User => {
        class ExtendedUser extends User {
            constructor(client, data) {
                super(client, data);
                this.Instance = Bot;
            }
        }
    
        return ExtendedUser;
    });