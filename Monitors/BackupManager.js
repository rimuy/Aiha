const Server = require('../Server');
const { BACKUP_INTERVAL, OWNER_ID } = require('../Internals/Contants');
var lastUpdate = 0;
var interval;
var waiting;

class BackupManager {

    static #instance;

    static get Bot() {
        return this.#instance;
    }

    static set Bot(value) {
        this.#instance = value;
    }

    static async trigger(time = BACKUP_INTERVAL) {
        interval && clearInterval(interval);

        const settings = await Server.Database.request('GET', 'settings');
        lastUpdate = Date.now();
        waiting = time - Math.max(lastUpdate - (settings.lastBackup || lastUpdate), 0);

        const dev = await this.Bot.client.users.fetch(OWNER_ID);

        interval = setInterval(async () => {
        
            await this.Bot.commands.get('backup').run(null, dev, this.Bot);
            settings.lastBackup = Date.now();
            lastUpdate = settings.lastBackup;

            await Server.Database.request('PATCH', 'settings', { lastBackup: settings.lastBackup })
                .then(async () => {
                    const id = (await Server.Database.request('GET', 'settings')).testingChannel;
                    const channel = this.Bot.client.channels.cache.get(id);

                    channel &&
                        channel.send(`${this.Bot.emojis.get('bot2Success')} <@${dev.id}> **foi realizado o backup automático!**`);

                })
                .catch(console.log);
            
        }, waiting);

    }

    static get remaining() {
        return Math.max((lastUpdate + waiting) - Date.now(), 0);
    }

}

module.exports = BackupManager;