const Server = require('../../Server');

module.exports = async (user, msg, level) => {
    const roles = await Server.Database.request('GET', 'levelroles');
    const guild = msg.guild;
    const member = await guild.members.fetch(user);

    if (!msg.instance.fetched) {
        await guild.roles.fetch();
        msg.instance.fetched = true;
    }

    if (member) {
        const levelRoles = [];

        Object.keys(roles).forEach(roleId => {
            const role = guild.roles.cache.get(roleId);
            const info = roles[roleId];
            
            if (role && level >= info.requiredLevel) {

                levelRoles.push({ 
                    role,
                    level: info.requiredLevel, 
                });
            
            }
            else if (role && level < info.requiredLevel) 
                member.roles.remove(role.id).catch();
        });

        const highestLevel = Math.max(...levelRoles.map(r => r.level));

        await Promise.all(
            levelRoles
                .filter(r => r.role.editable)
                .map(async r => {
                    if (r.level === highestLevel) {
                        await member.roles.add(r.role.id).catch();
                    } else {
                        await member.roles.remove(r.role.id).catch();
                    }
                })
        );

    }

};