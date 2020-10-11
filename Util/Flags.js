const { FLAG_PREFIX, FLAG_ALIAS_PREFIX } = require('../Internals/Contants');

module.exports = class FlagObject
{
    static info = new Map()
        .set('delete', {
            aliases: ['D'],
            description: 'Deleta sua mensagem após executar o comando.',
        })
        .set('double', {
            aliases: ['d'],
            description: 'Executa o mesmo comando duas vezes.',
        })
        .set('help', {
            aliases: ['h'],
            description: 'Exibe informações sobre o comando.\n(Idêntico à `help` `<comando>`)',
        })
        .set('mention', {
            aliases: ['m'],
            description: 'Menciona o usuário depois da execução do comando.',
        })
        .set('noreturn', {
            aliases: ['n'],
            description: '**[Dev-Only]** Bloqueia o retorno do comando.',
        })
        .set('ping', {
            aliases: ['p'],
            description: 'Retorna em milisegundos o tempo de execução do comando.',
        })
        .set('private', {
            aliases: ['P'],
            description: 'Direciona a saída do comando para seu DM.',
        })
        .set('twice', {
            aliases: ['t'],
            description: 'Executa o comando mais uma vez após a execução do mesmo.',
        });

    constructor(string) 
    {
        const placeholder = '{SPACE}';

        this.string = string;
        this.collection = [];

        let str = string
            .replace(/(\{).+(\})/g, `$1${placeholder}$2`)
            .replace(/(\().+(\))/g, `$1${placeholder}$2`)
            .replace(/(<).+(>)/g,   `$1${placeholder}$2`)
            .replace(/(\[).+(\])/g, `$1${placeholder}$2`);

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
            .replace(/- /g, '')
            .replace(/--\w+/g ,'');
    }
};