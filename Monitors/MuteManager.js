const Server = require('../Server');
const { MuteRole, Logs } = require('../Modules');
const BaseEmbed = require('../Internals/Structures/BaseEmbed');
const moment = require('moment-timezone');
const timeouts = new Map();

class MuteManager {

    static #botInstance;

    static get Bot() {
        return this.#botInstance;
    }

    static set Bot(obj) {
        this.#botInstance = obj;
    }

    static async add(id = '', options = {}) {
        const res = await Server.Database.request('POST', `muted/${id}`, options);

        if (res.id && res.guild) {
            const guild = this.Bot.client.guilds.cache.get(res.guild);

            if (guild) {
                const muteRole = MuteRole.get(guild);

                await guild.members.fetch(res.id)
                    .then(member => {
                        member.roles.add(muteRole, res.reason);

                        const logEmbed = new BaseEmbed()
                            .setTitle('Membro Silenciado')
                            .addFields(
                                { 
                                    name: 'Usuário', 
                                    value: `<@${member.id}>`, 
                                    inline: true, 
                                },
                                { 
                                    name: 'Moderador', 
                                    value: res.moderator ? `<@${res.moderator}>` : `<@${this.Bot.client.user.id}>`, 
                                    inline: true, 
                                },
                                { 
                                    name: 'Motivo', 
                                    value: `\`${res.reason || 'Nenhum motivo foi registrado.'}\``, 
                                    inline: false, 
                                },
                            );

                        Logs(guild, logEmbed);
                    })
                    .catch(() => 'Either member is not in the guild or the role doesn\'t exist.');
            }

            await MuteManager.check(res);
        }

        return res;
    }

    static async delete(id, reason, moderator = this.Bot.client.user.id) {
        const muted = await this.get(id);

        if (muted.id && muted.guild) {
            const guild = this.Bot.client.guilds.cache.get(muted.guild);

            if (guild) {
                const muteRole = MuteRole.get(guild);

                await guild.members.fetch(muted.id)
                    .then(member => {
                        member.roles.remove(muteRole, reason || 'Time expired.');

                        const logEmbed = new BaseEmbed()
                            .setTitle('Membro Desmutado')
                            .addFields(
                                { 
                                    name: 'Usuário', 
                                    value: `<@${member.id}>`, 
                                    inline: true,
                                },
                                { 
                                    name: 'Moderador', 
                                    value: `<@${moderator}>`, 
                                    inline: true, 
                                },
                                { 
                                    name: 'Motivo', 
                                    value: `\`${reason || 'Tempo de mute esgotado.'}\``, 
                                    inline: false, 
                                },
                            );

                        Logs(guild, logEmbed);
                    })
                    .catch(() => 'Either member is not in the guild or the role doesn\'t exist.');
            }
        }

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

            await MuteManager.delete(muted.id);
        }
        else if (!timeouts.has(muted.id)) {

            timeouts.set(
                muted.id, 
                setTimeout(async () => {
                    await MuteManager.delete(muted.id);
                    timeouts.delete(muted.id);

                }, muted.time - timePassed)
            );
        }

    }
}

(async () => {
    const all = await Server.Database.request('GET', 'muted');
    if (!all || !all.length) return;

    all.filter(muted => muted.time).forEach(MuteManager.check);
})();

module.exports = MuteManager;