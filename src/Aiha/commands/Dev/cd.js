/**
 *      Kevinwkz - 2020/09/20
 */

const { Command, PageEmbed, ZeroWidthSpace } = require('../..');
const { color } = require('./.config.json');
const Path = require('path');
const { readdirSync, lstatSync } = require('fs');

class CD extends Command {
    constructor() {
        super('cd', {
            category: 'Developer',
            hidden: true,
            dev: true,
        });
    }
    
    run(Bot, msg, args) {

        const md = 'css';
        const fullDir = Path.join(__dirname, '..', '..', '..', '..', ...args);
        const dir = readdirSync(fullDir);
        const limit = 10;

        new PageEmbed(
            msg, 
            dir
                .sort((a, b) => {

                    const valA = lstatSync(
                        Path.join(fullDir, a)
                    ).isDirectory() ? 1 : 0;

                    const valB = lstatSync(
                        Path.join(fullDir, b)
                    ).isDirectory() ? 1 : 0;

                    return valB - valA;
                })
                .map((e, i) => {
                    const str = `${e}${
                        lstatSync(Path.join(fullDir, e)).isDirectory() ? '/' : ''
                    }${`\ ${ZeroWidthSpace}`.repeat(35 - e.length)}` ;

                    if (!(i % limit)) return `\`\`\`${md}\n${str}${i === dir.length - 1 ? `\`\`\`` : ''}`;
                    if (!((i + 1) % limit) || i === dir.length - 1) return `${str}\n\`\`\``;

                    return str;
                }),
            limit
        )
            .setTitle(`📂${`\ ${ZeroWidthSpace}`.repeat(4)}/${args.join(' ')}`)
            .setColor(color)
            .send();

    }
}

module.exports = CD;