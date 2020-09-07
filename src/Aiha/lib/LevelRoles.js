
module.exports = async (Bot, user, msg, level) => {
    const roles = await Bot.server.request('GET', 'levelroles');
    const guild = msg.guild;
    const member = await guild.members.fetch(user);

    if (member) {
        const levelRoles = [];

        await Promise.all(Object.keys(roles).map(async roleId => {
            const role = await guild.roles.fetch(roleId);
            const info = roles[roleId];
            
            if (role && level >= info.requiredLevel) {

                levelRoles.push({ 
                    role,
                    level: info.requiredLevel, 
                });
            
            }
        }));

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