const { Flag, AihaSet } = require('../Internals');
const { FLAG_PREFIX, FLAG_ALIAS_PREFIX } = require('../Internals/Contants');
const json = require('../Configuration/json/Flags.json');

class FlagObject
{
    static info = new Map();

    constructor(string) 
    {
        const placeholder = '|SPACE|';
        const replaced = [];

        this.string = string;
        this.collection = new AihaSet();

        let str = string;

        [/(\{).+(\})/g, /(\().+(\))/g, /(<).+(>)/g, /(\[).+(\])/g]
            .forEach(regexp => 
                (string.match(regexp) || []).forEach(s => {
                    // eslint-disable-next-line no-useless-escape
                    replaced.push(Buffer.from(s.replace(/[\[{(<>)}\]]/g, '')));
                    str = string.replace(regexp, `$1${placeholder}$2`);
                })
            );

        let aliases = str
            .split(' ')
            .filter(s => s.match(/-\w+/));

        if (aliases && aliases.length)
            aliases = aliases.map(a => a.slice(FLAG_ALIAS_PREFIX.length));
        else
            return this;

        if (aliases.length) 
        {
            aliases.join('').split('').forEach(a => {
                // eslint-disable-next-line no-useless-escape
                str = str.replace(new RegExp(` ${FLAG_ALIAS_PREFIX}\w*${a}`, 'g'), '');
            });
        }

        [...new Set(aliases.join('').split(''))]
            .forEach(s => {
                const map = [...FlagObject.info].find(e => e[1].aliases.includes(s));
                if (map) 
                    str += ` ${FLAG_PREFIX}${map[0]}`;
            });

        let params = str
            .split(' ')
            .filter(p => ![FLAG_PREFIX, FLAG_ALIAS_PREFIX].some(e => p.startsWith(e)));

        /* Space characters support */
        let previous;

        params.forEach((current, i) => {
            if (!i) return;
            
            if (previous < i) {
                params[previous] += ' ' + current;
                params.splice(i, 1);
            }

            if (current.startsWith('"'))
                previous = i;
            else if (current.endsWith('"')) {
                previous = null;
            }
            
        });

        let p = 0;

        this.collection =
            new AihaSet(
                str
                    .split(' ')
                    .filter(s => s.startsWith(FLAG_PREFIX))
                    .map(s => {

                        const name = s.replace(FLAG_PREFIX, '');
                        const parameter = params[p] ? params[p].replace(/"/g, '') : null;

                        if (FlagObject.info.get(name).isFunction) p++;

                        return new Flag({ name, parameter });
                    })
            );
        

        this.string = str
            .replace(/- /g,    '')
            .replace(/--\w+/g, '')
            .replace(/\\/g,    '');

        replaced.forEach(s => {
            this.string = this.string.replace(placeholder, s.toString());
        });
    }
}

json.forEach(flag => {
    FlagObject.info.set(flag.label, { 
        aliases: flag.aliases, 
        description: flag.description,
        isFunction: flag.isFunction || false, 
    });
});

module.exports = FlagObject;