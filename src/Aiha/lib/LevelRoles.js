
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
        const rolesToAdd = levelRoles
            .filter(r => r.level === highestLevel);

        await member.roles.set([
            ...rolesToAdd.map(r => r.role.id), 
            ...member.roles.cache
                .filter(r => !levelRoles.map(rl => rl.role.id).includes(r.id))
                .map(r => r.id)
        ]).catch(error => { /*Bot.report(error)*/ });
    }

};