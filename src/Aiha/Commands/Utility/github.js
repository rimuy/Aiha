/**
 *      Kevinwkz - 2020/09/18
 */

const { Internals, Configuration } = require('../..');

class GitHub extends Internals.Command {
    constructor() {
        super('github', {
            description: 'Exibe o link do repositório oficial do bot.',
            usage: 'github',
            aliases: ['repo'],
            category: 'Utilidades',
        });
    }

    run = msg => msg.target.send(Configuration.Social.github);
}

module.exports = GitHub;