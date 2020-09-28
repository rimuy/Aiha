const { PageSeparator } = require('../Contants');
const { ReactionCollector, MessageEmbed } = require('discord.js');
const BaseEmbed = require('./BaseEmbed');

const cache = new Map();

class PageEmbed extends MessageEmbed {

    #message;
    embedData = [];
    pages = [];
    current = 0;

    constructor(message, listOrString, limit = 20, embedData = []) {
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

                this.pages[this.current] = '' + e;
                sizeCount += e.length;
            });

        } else {
            let n = 0;

            listOrString.forEach((e, i) => {
                if (i > 0 && !(i % limit)) this.pages[++n] = '';
                this.pages[n] += e + '\n';
            });
        }

        const page = (
            parseInt(message.content
                .split(' ')
                .slice(1)
                .join(' ')
                .split(PageSeparator)[1]) || 1
        ) - 1;

        this.current = this.current = page > this.pages.length
            ? this.pages.length - 1 
            : Math.max(0, page);

        return this;
    }

    send() {

        const message = this.#message;
        const pages = this.pages;
        let current = this.current;

        const cached = cache.get(message.author.id);
        cached && cached.stop();

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

                const pageReactions = ['pleft', 'pright'];
                const reactions = [];

                const manager = [
                    () => current - 1,
                    () => current + 1,
                ];

                pageReactions
                    .map((key, i) => {
                        const emoji = message.Instance.emojis.get(key);
                        const e = emoji ? `:${emoji.name}:${emoji.id}` : ['⬅️', '➡️'][i % 2];

                        emoji 
                            ? reactions.push(emoji.name)
                            : reactions.push(e);
                    
                        return e;
                    })
                    .forEach(async emoji => await msg.react(emoji));

                const filter = (reaction, user) => 
                    manager[reactions.indexOf(reaction.emoji.name)] && user.equals(message.author);

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
                cache.set(message.author.id, collector);

                collector.on('collect', async reaction => {
                    const newIndex = manager[reactions.indexOf(reaction.emoji.name)]();

                    if (newIndex >= 0 && newIndex <= pages.length - 1) {
                        current = newIndex;
                        this.current = current;

                        this.setDescription(pages[current]);
                        this.setFooter(`Página ${current + 1}/${pages.length}`);
                        this.loadEmbedData();

                        await msg.edit(this);
                        timer();
                    }

                    reaction.users.cache.forEach(async user => 
                        !user.equals(msg.author) && await reaction.users.remove(user.id));
                    
                });

                collector.on('end', async () => {
                    msg.edit(this.setTimestamp().setFooter(`Página ${current + 1}`));
                    cache.delete(message.author.id);
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