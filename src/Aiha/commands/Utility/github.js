/**
 *      Kevinwkz - 2020/09/18
 */

const { Command, Social } = require('../..');

class GitHub extends Command {
    constructor() {
        super('github', {
            description: 'Exibe o link do repositório oficial do bot.',
            usage: 'github',
            category: 'Utilidades',
        });
    }

    run = (_, msg) => msg.channel.send(Social.github);
}

module.exports = GitHub;