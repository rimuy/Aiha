/**
 *      Kevinwkz - 2020/10/11
 */

const { Internals, Util, ZeroWidthSpace } = require('../..');

class Flags extends Internals.Command {
    constructor() {
        super('flags', {
            description: 'Exibe uma lista com todas as flags que podem ser usadas nos comandos.',
            usage: 'flags',
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS'],
            blockFlags: ['double', 'twice'],
        });
    }

    run(msg) {

        const examplecmd = msg.instance.commands
            .filter(c => !c.userPerms.length && !c.dev && !c.hidden)
            .random()
            .name;

        const randomFlags = [...Util.Flags.info.values()]
            .map(obj => obj.aliases)
            .map(aliases =>  aliases[Math.floor(Math.random() * aliases.length)][0]);

        const randomFlag = randomFlags[Math.floor(Math.random() * randomFlags.length)];

        const limit = 4;
        const flags = [...Util.Flags.info.keys()]
            .map((f, i) => {
                const info = Util.Flags.info.get(f);
                const aliases = info.aliases;
                const description = info.description;

                return `${!(i % limit) ? `\n**Exemplo:** ${examplecmd} -${randomFlag}\n` : ZeroWidthSpace}\n🏳️\n> 🔖 **Flag:** \`${
                    Internals.Constants.FLAG_PREFIX
                }${f}\`${
                    (' ' + ZeroWidthSpace).repeat(2)
                }**->**${
                    (' ' + ZeroWidthSpace).repeat(2)
                }**{** ${aliases.map(a => `\`${a}\``)} **}**\n> 📘 **Descrição:** ${description}`;
            });

        new Internals.PageEmbed(msg, flags, limit)
            .setAuthor('Flags', msg.author.displayAvatarURL({ dynamic: true }))
            .send();
        
    }
}

module.exports = Flags;