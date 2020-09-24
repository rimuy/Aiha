const BaseEmbed = require('./BaseEmbed');
const { ReactionCollector, MessageEmbed } = require('discord.js');

class PageEmbed extends MessageEmbed {

    #message;
    embedData = [];
    pages = [''];
    current = 0;

    constructor(message, listOrString, limit = 20, page = 0, embedData = []) {
        super();

        this.#message = message;
        this.embedData = embedData;
        this.setColor(BaseEmbed.defaultColor);
    
        if (typeof listOrString === 'string') {
            
            const maxSize = 400; // 2048
            let sizeCount = 0;

            listOrString.split('').forEach(e => {
                if (sizeCount + e.length > maxSize) {
                    sizeCount = 0;
                    this.pages[++this.current] = '';
                }

                this.pages[this.current] += e;
                sizeCount += e.length;
            });

        } else {
            let n = 0;

            listOrString.forEach((e, i) => {
                if (i > 0 && !(i % limit)) this.pages[++n] = '';
                this.pages[n] += e + '\n';
            });
        }

        this.current = this.current = page > this.pages.length
            ? this.pages.length - 1 
            : Math.max(0, page);

        return this;
    }

    send() {

        const message = this.#message;
        const pages = this.pages;
        let current = this.current;

        this.setDescription(this.pages[this.current]);

        if (this.pages.length > 1) {
            this.setFooter(`Página ${this.current + 1}/${this.pages.length}`);
        } else {
            this.setTimestamp();
        }

        this.loadEmbedData();

        message.channel.send(this)
            .then(async msg => {

                if (pages.length < 2) return;

                const filter = (reaction, user) => 
                    reactions[reaction.emoji.name] && user.equals(message.author);

                const reactions = {
                    '⬅️': () => current - 1,
                    '➡️': () => current + 1,
                };
                const keys = Object.keys(reactions);

                await msg.react(keys[0])
                    .then(async () => await msg.react(keys[1]))
                    .catch();

                const startTime = Date.now();
                const unfreezeTime = 10000;
                const duration = 30000;

                let timeout;

                const timer = () => {
                    if (Date.now() - startTime >= unfreezeTime || !timeout) {
                        const timeToWait = timeout ? unfreezeTime : duration;
                        timeout && clearTimeout(timeout);
                        timeout = setTimeout(() => {
                            collector.stop(); 
                            timeout = null;
                        }, timeToWait);
                    }
                };

                const collector = new ReactionCollector(msg, filter);

                collector.on('collect', async reaction => {
                    const newIndex = reactions[reaction.emoji.name]();

                    if (newIndex >= 0 && newIndex <= pages.length - 1) {
                        current = newIndex;
                        this.current = current;

                        this.setDescription(pages[current]);
                        this.setFooter(`Página ${current + 1}/${pages.length}`);
                        this.loadEmbedData();

                        await msg.edit(this);
                        timer();
                    }
                    
                });

                collector.on('end', async () => {
                    await msg.reactions.removeAll();
                    msg.edit(this.setTimestamp().setFooter(`Página ${current + 1}`));
                });

                timer();
            })
            .catch();
    }

    loadEmbedData() {
        const data = this.embedData[this.current];

        if (data) {
            Object.keys(data).forEach(key => {
                this[key] = data[key];
            });
        }

    }
}

module.exports = PageEmbed;