const { Client, Collection, Intents } = require('discord.js');
const CategoriesEmojis = require('../config/json/CategoriesEmojis.json');
const log = require('../util/Log');

const Server = require('../../../server');
const Developers = require('../config/json/devs.json');

class AihaBot {
    constructor() {
        
        this.client.once('ready', async () => {
            log('FG_YELLOW', 'Ready.');

            require('../monitors/CommandHandler')(this);
            require('../monitors/EventListener')(this);

            const devGuild = this.client.guilds.cache.get(process.env.DEV_GUILD);
            devGuild.emojis.cache.forEach(e => this.emojis.set(e.name, e));

            Object.keys(CategoriesEmojis).forEach(key => 
                this.categoriesEmojis.set(key, CategoriesEmojis[key])
            );

            this.updateStatus();

            /* Auto-Backup */
            const devs = [];

            Developers.forEach(async id => {
                const dev = await this.client.users.fetch(id);

                dev && devs.push(dev);
            });

            setInterval(async () => {
                await Promise.all(devs.map(dev => 
                    dev.send(this.commands.get('backup').run(this, null, dev))
                ));
            }, process.env.AUTO_BACKUP_INTERVAL);

        });
            
    }

    client = new Client({
        ws: { intents: Intents.ALL }
    });

    events = new Collection();

    commands = new Collection();

    aliases = new Collection();

    emojis = new Collection();

    categoriesEmojis = new Collection();

    timedMutes = new Collection();

    report = require('../lib/BotReport');

    async updateStatus() {
        this.client.user.setActivity(
            (await Server.Database.request('GET', 'settings')).prefix + 'help');
    }
    
}

module.exports = AihaBot;