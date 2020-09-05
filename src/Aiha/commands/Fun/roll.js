/**
 *      Kevinwkz - 2020/09/02
 */

const { Command, BaseEmbed } = require('../..');

const defaultN = 6;

class Roll extends Command {
    constructor() {
        super('roll', {
            description: '',
            usage: `roll \`<número> ou ${defaultN}\``,
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
        });
    }

    run(Bot, msg, args) {

        const max = parseInt(args[0] || defaultN.toString());
        const result = Math.floor(Math.random() * max) + 1;
        
        msg.channel.send(
            new BaseEmbed()
                .setDescription(`🎲 Você jogou um \`${result}\`!`)
        );

    }
}

module.exports = Roll;