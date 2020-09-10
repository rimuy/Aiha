const { MessageEmbed } = require('discord.js');

class BaseEmbed extends MessageEmbed {
    color;

    constructor() {
        super();
        this.setColor(0xff0a68).setTimestamp();
    }

    static get defaultColor() {
        return this.color;
    };
}

module.exports = BaseEmbed;