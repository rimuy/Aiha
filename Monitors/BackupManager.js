const moment = require('moment-timezone');
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
                .then(() => this.Bot.report('Foi realizado o backup automático dos dados!', 'normal', true))
                .catch(console.log);
            
        }, waiting);

    }

    static remaining() {
        return Math.max((lastUpdate + waiting) - Date.now(), 0);
    }

    static get nextBackup() {
        return moment(Date.now() + this.remaining()).format('YYYY-MM-DD HH:mm:ss');
    }

}

module.exports = BackupManager;