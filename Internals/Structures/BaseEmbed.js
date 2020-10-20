const { MessageEmbed } = require('discord.js');

class BaseEmbed extends MessageEmbed {
    constructor() {
        super();
        this.setColor(BaseEmbed.defaultColor).setTimestamp();
    }

    static defaultColor = 0xe2379b;
    static errorColor = 0xc9482e;
    static successColor = 0x3bc92e;
    static warningColor = 0xfad905;
}

module.exports = BaseEmbed;