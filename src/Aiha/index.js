
module.exports = {
    // Structs
    Bot: require('./structures/AihaBot'),
    BaseEmbed: require('./structures/BaseEmbed'),
    Command: require('./structures/Command'),
    Event: require('./structures/Event'),

    // Misc
    Developers: require('./config/json/devs.json'),
    version: require('../../package.json').version
};