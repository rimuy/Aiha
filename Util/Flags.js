const { FLAG_PREFIX, FLAG_ALIAS_PREFIX } = require('../Internals/Contants');
const json = require('../Configuration/json/Flags.json');

class FlagObject
{
    static info = new Map();

    constructor(string) 
    {
        const placeholder = '{SPACE}';
        const replaced = [];

        this.string = string;
        this.collection = [];

        let str = '';

        [

            new RegExp(/(\{).+(\})/, 'g'),
            new RegExp(/(\().+(\))/, 'g'),
            new RegExp(/(<).+(>)/,   'g'),
            new RegExp(/(\[).+(\])/, 'g'),

        ].forEach(regexp => 
            (string.match(regexp) || []).forEach(s => {
                // eslint-disable-next-line no-useless-escape
                replaced.push(s.replace(/[\[{(<>)}\]]/g, ''));
                str = string.replace(regexp, `$1${placeholder}$2`);
            })
        );

        let aliases = str
            .split(' ')
            .find(s => s.match(/-\w+/));

        if (aliases)
            aliases = aliases.slice(FLAG_ALIAS_PREFIX.length);
        else
            return this;

        if (aliases.length) 
        {
            aliases.split('').forEach(a => {
                // eslint-disable-next-line no-useless-escape
                str = str.replace(new RegExp(` ${FLAG_ALIAS_PREFIX}\w*${a}`, 'g'), '');
            });
        }

        aliases
            .split('')
            .forEach(s => {
                const map = [...FlagObject.info].find(e => e[1].aliases.includes(s));

                if (map) 
                    str += ` ${FLAG_PREFIX}` + map[0];
            });

        this.collection = str
            .split(' ')
            .filter(s => s.startsWith(FLAG_PREFIX))
            .map(s => s.replace(FLAG_PREFIX, ''));

        this.string = str
            .replace(/- /g,    '')
            .replace(/--\w+/g, '')
            .replace(/\\/g,    '');

        replaced.forEach(s => {
            this.string = this.string.replace(placeholder, s);
        });
    }
}

json.forEach(flag => {
    FlagObject.info.set(flag.label, { 
        aliases: flag.aliases, 
        description: flag.description 
    });
});

module.exports = FlagObject;