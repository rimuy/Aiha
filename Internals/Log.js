const moment = require('moment-timezone');
const { ConsoleColors } = require('./Contants');

module.exports = (...content) => {
    console.log((() => {
        const color = ConsoleColors[(typeof content[0] === 'string' && ConsoleColors[content[0].toUpperCase()]) ? content[0].toUpperCase() : null];

        if (color) {
            content.shift();
            return '\x1b' + color;
        } else { return ''; }

    })() + `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${content.join(' ')}\x1b${ConsoleColors.NORMAL}`);
};