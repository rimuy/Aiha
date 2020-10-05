const { Structures } = require('discord.js');
const { MemberCounter } = require('../../Monitors');

module.exports = Bot => 
    Structures.extend('Guild', Guild => {
        class AihaGuild extends Guild {
            constructor(client, data) {
                super(client, data);
                this.instance = Bot;
            }

            updateMemberCounter(fetchGuild) {
                return MemberCounter.update(this, fetchGuild);
            }
        }
    
        return AihaGuild;
    });