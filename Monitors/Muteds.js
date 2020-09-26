const Server = require('../Server');
const { MuteRole } = require('../Modules');
const moment = require('moment-timezone');
const timeouts = new Map();

class Muteds {

    static #botInstance;

    static get Bot() {
        return this.#botInstance;
    }

    static set Bot(obj) {
        this.#botInstance = obj;
    }

    static async add(id = '', options = {}) {
        const res = await Server.Database.request('POST', `muted/${id}`, options);

        if (res.id) {
            await Muteds.check(res);
        }

        return res;
    }

    static async delete(id) {
        return await Server.Database.request('DELETE', `muted/${id}`);
    }

    static async get(id) {
        return await Server.Database.request('GET', `muted/${id || ''}`);
    }

    static async check(muted) {
        if (!muted.time) return;

        const timeout = timeouts.get(muted.id);
        const timePassed = Date.now() - moment(muted.timestamp).format('x');

        if (timePassed >= muted.time) {

            if (timeout) {
                clearTimeout(timeout);
                timeouts.delete(muted.id);
            }

            await Muteds.delete(muted.id);
        }
        else if (!timeouts.has(muted.id)) {

            timeouts.set(
                muted.id, 
                setTimeout(async () => {
                    await Muteds.delete(muted.id);
                    timeouts.delete(muted.id);
                    
                    const guild = this.Bot.client.guilds.cache.get(muted.guild);

                    if (guild) {
                        const muteRole = MuteRole.get(guild);

                        guild.members.fetch(muted.id)
                            .then(member => member.roles.remove(muteRole, 'Time expired.'))
                            .catch(() => 'Either member is not in the guild or the role doesn\'t exist.');
                    }

                }, muted.time - timePassed)
            );
        }

    }
}

(async () => {
    const all = await Server.Database.request('GET', 'muted');
    if (!all || !all.length) return;

    all.filter(muted => muted.time).forEach(Muteds.check);
})();

module.exports = Muteds;