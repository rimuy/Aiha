const { MessageEmbed } = require('discord.js');

class BaseEmbed extends MessageEmbed {
    constructor() {
        super();
        this.setColor(0xff0a68).setTimestamp();
    }

    static defaultColor = 0xff0a68;
}

module.exports = BaseEmbed;