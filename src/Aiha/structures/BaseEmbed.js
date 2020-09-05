const { MessageEmbed } = require('discord.js');

class BaseEmbed extends MessageEmbed {
    constructor() {
        super();
        this.setColor(0xdd87e8).setTimestamp();
    }

    static defaultColor = 0xdd87e8;
}

module.exports = BaseEmbed;