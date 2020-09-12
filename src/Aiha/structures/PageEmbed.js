const BaseEmbed = require('./BaseEmbed');
const { ReactionCollector, MessageEmbed } = require('discord.js');

class PageEmbed extends MessageEmbed {

    #message;
    pages = [''];
    current = 0;

    constructor(message, listOrString, limit = 20) {
        super();

        this.#message = message;
        this.setColor(BaseEmbed.defaultColor);
        
        let pages = this.pages;
        let current = this.current;

        if (typeof listOrString === 'string') {
            
            const maxSize = 400; // 2048
            let sizeCount = 0;

            listOrString.split('').forEach(e => {
                if (sizeCount + e.length > maxSize) {
                    sizeCount = 0;
                    pages[++current] = '';
                }

                pages[current] += e;
                sizeCount += e.length;
            });

        } else {
            let n = 0;

            listOrString.forEach((e, i) => {
                if (i > 0 && !(i % limit)) pages[++n] = '';
                pages[n] += e + '\n';
            });
        }

        this.setDescription(pages[current]);
        this.setFooter(`Página ${current + 1}/${pages.length}`);

        return this;
    }

    send() {

        const message = this.#message;
        const pages = this.pages;
        let current = this.current;

        message.channel.send(this)
            .then(async msg => {

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
                        timeout && clearTimeout(timeout);
                        timeout = setTimeout(() => {
                            collector.stop(); 
                            timeout = null;
                        }, duration);
                    }
                };

                const collector = new ReactionCollector(msg, filter);

                collector.on('collect', async reaction => {
                    const newIndex = reactions[reaction.emoji.name]();

                    if (newIndex >= 0 && newIndex <= pages.length - 1) {
                        current = newIndex;

                        this.setDescription(pages[current]);
                        this.setFooter(`Página ${current + 1}/${pages.length}`);

                        await msg.edit(this);
                        timer();
                    }
                    
                });

                collector.on('end', () => msg.edit(this.setTimestamp().setFooter('')));

                timer();
            })
            .catch();
    }
}

module.exports = PageEmbed;