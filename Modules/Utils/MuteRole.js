const { Permissions } = require('discord.js');

class MuteRole {
    static get(guild) {
        return guild.roles.cache.find(r => r.name.toUpperCase() === 'MUTED');
    }

    static async create(guild) {
        let role;

        await guild.roles.create({
            data: {
                name: 'Muted',
                color: 'DARK_BUT_NOT_BLACK',
                hoist: false,
                mentionable: false,
                position: 2,
                permissions: new Permissions().remove(0x800 | 0x200000),
            }
        })
            .then(r => {
                role = r;

                guild.channels.cache
                    .filter(ch => ['VIEW_CHANNEL', 'MANAGE_ROLES'].every(p => guild.me.permissionsIn(ch).has(p)))
                    .each(ch => {
    
                        switch(ch.type) {
                        case 'text':

                            ch.createOverwrite(role, { SEND_MESSAGES: false }).catch();
                            break;
                        case 'voice':
                                
                            ch.createOverwrite(role, { SPEAK: false }).catch();
                            break;
                        }

                    });
            })
            .catch(console.log);
            
        return role;
    }
}

module.exports = MuteRole;