/**
 *      Kevinwkz - 2020/09/18
 */

const { Internals, Social } = require('../..');

class GitHub extends Internals.Command {
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