const { Server } = require('..');
const LevelRoles = require('./LevelRoles');

const usersOnCooldown = new Map();
const cooldown = 5000;

const earnXP = content => 
    content.split(' ').map(c => c.length).slice(0, 6).reduce((a, b) => (a + b) * .78);

module.exports = async (Bot, msg) => {

    const user = msg.author;

    let expCd = usersOnCooldown.get(user.id);
    if (!expCd) { 
        expCd = usersOnCooldown.set(user.id, 1).get(user.id);
    };

    if (expCd && (new Date() - expCd) > cooldown) {
        const data = await Server.Database.request('GET', `users/${user.id}`) || { level: 0, exp: 0 };
        usersOnCooldown.set(user.id, new Date());
        data.exp += Math.floor(earnXP(msg.content));

        const eq = data.exp >= 150 + ( 225 * data.level );

        if (data.exp > 0 && eq) {
            data.exp = 0;
            await LevelRoles(Bot, user, msg, ++data.level);
            
            // Announcement
            const guild = await msg.guild.fetch();
            const perms = ['VIEW_CHANNEL', 'SEND_MESSAGES'];

            const announcementChannel = guild.me.permissionsIn(msg.channel).has(perms)
                ? msg.channel
                : ( guild.channels.cache
                    .find(ch => guild.me.permissionsIn(ch).has(perms)) );

            if (announcementChannel) {
                await announcementChannel.send(`<@${user.id}> Alcançou o nível **${data.level}**!`);
            }

        }

        await Server.Database.request('PATCH', `users/${user.id}`, { 
            level: data.level, 
            exp: data.exp,
        });
    }
};