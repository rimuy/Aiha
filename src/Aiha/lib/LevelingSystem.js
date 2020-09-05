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
        const newData = (await Bot.server.request('GET', 'users'))[user.id] || { level: 0, exp: 0 };
        usersOnCooldown.set(user.id, new Date());
        newData.exp += Math.floor(earnXP(msg.content));

        const eq = newData.exp >= 150 + ( 75 * newData.level );

        if (newData.exp > 0 && eq) {
            newData.exp = 0;
            await LevelRoles(Bot, user, msg, ++newData.level);
            
            await msg.channel.send(`<@${user.id}> Alcançou o nível **${newData.level}**!`);
        }

        await Bot.server.request('POST', `users/${user.id}`, newData);
    }
};