const { Client, Collection, Intents } = require('discord.js');
const Internals = require('..');
const Constants = require('../Contants');
const Monitors = require('../../Monitors');
const Configuration = require('../../Configuration');
const Server = require('../../Server');
const AihaSet = require('./AihaSet');

const log = require('../Log');

var fetched = false;

class Aiha {
    constructor() {

        console.log('\x1b' + Constants.ConsoleColors.FG_CYAN);
        Internals.Extenders = require('consign')({ loggingType: 'info' })
            .include('Internals/Extenders').into(this);

        this.client = new Client({
            ws: { intents: Intents.ALL }
        });
        
        this.client.once('ready', async () => {
            log('FG_YELLOW', 'Ready.');

            this.CommandHandler = new Monitors.CommandHandler(this);
            this.EventListener = new Monitors.EventListener(this);

            const devGuild = this.client.guilds.cache.get(process.env.DEV_GUILD);
            devGuild.emojis.cache.forEach(e => this.emojis.add(e));

            Object.keys(Configuration.CategoriesEmojis).forEach(key => 
                this.categoriesEmojis.set(key, Configuration.CategoriesEmojis[key])
            );

            this.updateStatus();

            /* Auto-Backup */
            setInterval(async () => {
                const dev = await this.client.users.fetch(process.env.OWNER);
                dev.send(this.commands.get('backup').run(this, null, dev));
                
            }, process.env.AUTO_BACKUP_INTERVAL);

        });
            
    }

    CommandHandler;
    EventListener;

    get fetched() {
        return fetched;
    }

    set fetched(value) {
        fetched = value;
    }

    categoriesEmojis = new Collection();

    commands = new AihaSet();

    emojis = new AihaSet();

    events = new AihaSet();

    pageEmbeds = new AihaSet();

    report = require('../../Modules/BotReport');

    async updateStatus() {
        this.client.user.setActivity(
            (await Server.Database.request('GET', 'settings')).prefix + 'help');
    }

    levelEquation(level) {
        return 150 + ( 225 * level );
    }
    
}

module.exports = Aiha;