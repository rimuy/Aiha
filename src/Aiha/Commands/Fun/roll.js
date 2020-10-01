/**
 *      Kevinwkz - 2020/09/02
 */

const { Internals } = require('../..');

const defaultN = 6;

class Roll extends Internals.Command {
    constructor() {
        super('roll', {
            description: '',
            usage: `roll \`<número> ou ${defaultN}\``,
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
        });
    }

    run(msg, args) {

        const max = parseInt(args[0] || defaultN.toString());
        const result = Math.floor(Math.random() * max) + 1;
        
        msg.channel.send(
            new Internals.BaseEmbed()
                .setDescription(`🎲 Você jogou um \`${result}\`!`)
        );

    }
}

module.exports = Roll;