/**
 *      Kevinwkz - 2020/09/02
 */

const { Internals } = require('../..');
const { color } = require('./.config.json');

const tails = ['Cara', 'Coroa'];

class CoinFlip extends Internals.Command {
    constructor() {
        super('coinflip', {
            description: '',
            usage: 'coinflip',
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            blockFlags: ['double'],
        });
    }

    run(msg) {

        const result = Math.floor(Math.random() * 2);

        msg.target.send(
            new Internals.BaseEmbed()
                .setColor(color)
                .setDescription(`${['👤', '👑'][result]} Você tirou **${tails[result]}**!`)
        );
        
    }
}

module.exports = CoinFlip;