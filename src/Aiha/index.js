
module.exports = {
    // Structs
    Bot: require('./structures/AihaBot'),
    BaseEmbed: require('./structures/BaseEmbed'),
    Command: require('./structures/Command'),
    Event: require('./structures/Event'),
    PageEmbed: require('./structures/PageEmbed'),

    // External
    Server: require('../../server'),
    API: require('../../api'),

    // Misc
    MudaeObserver: require('./monitors/MudaeObserver'),

    Developers: require('./config/json/devs.json'),
    version: require('../../package.json').version
};