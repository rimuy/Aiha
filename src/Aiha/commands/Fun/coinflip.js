/**
 *      Kevinwkz - 2020/09/02
 */

const { Command, BaseEmbed } = require('../..');

const tails = ['Cara', 'Coroa'];

class CoinFlip extends Command {
    constructor() {
        super('coinflip', {
            description: '',
            usage: 'coinflip',
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
        });
    }

    run(Bot, msg) {

        const result = Math.floor(Math.random() * 2);

        msg.channel.send(
            new BaseEmbed()
                .setDescription(`${['👤', '👑'][result]} Você tirou **${tails[result]}**!`)
        );
        
    }
}

module.exports = CoinFlip;