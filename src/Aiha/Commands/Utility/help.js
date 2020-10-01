/**
 *      Kevinwkz - 2020/08/28
 */

const { Internals, Server, ZeroWidthSpace } = require('../..');

class Help extends Internals.Command {
    constructor() {
        super('help', {
            description: 'Retorna a lista de comandos do bot, ou informações sobre um comando específico.',
            usage: 'help `[comando]`',
            aliases: ['h', 'hawp', 'ajuda'],
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(msg, args) {
        
        const bot = msg.instance;

        let cmd = (args[0] || '').toLowerCase();

        const categories = new Map();
        const command = bot.commands.get(cmd) || bot.aliases.get(cmd);
        const prefix = (await Server.Database.request('GET', 'settings')).prefix;

        const embed = new Internals.BaseEmbed()
            .setFooter(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }));

        bot.commands.forEach(c => {
            if(c.category && !c.hidden && !c.dev && c.category !== 'Admin') {
                const arr = categories.get(c.category);

                arr
                    ? arr.push(c.name)
                    : categories.set(c.category, [c.name]);
            }
        });
        
        if (command) {

            const info = {
                'name': 'Nome',
                'description': 'Descrição',
                'usage': 'Modo de uso',
                'aliases': 'Aliases',
                'userPerms': 'Permissões',
            };
            
            const format = {
                'name': '`{}`',
                'usage': `${prefix}{}`,
                'aliases': '`{}`',
                'userPerms': '`{}`',
            };

            embed
                .setAuthor('Informações do Comando', bot.client.user.displayAvatarURL())
                .setDescription(
                    Object.keys(info)
                        .filter(key => command[key])
                        .map(key => {
                            if (format[key] && typeof command[key] !== 'object' )
                                command[key] = format[key].replace('{}', command[key]);

                            return `**${info[key]}:** ${
                                typeof command[key] === 'object' 
                                    ? (
                                        command[key].length 
                                            ? command[key].map(c => `${format[key] ? format[key].replace('{}', c) : c}`).join(', ')
                                            : 'Nenhuma'
                                    )
                                    : command[key]
                            }`;
                        })
                        .join('\n')
                );
        } else {

            embed
                .setTitle('Lista de Comandos')
                .setThumbnail(bot.client.user.displayAvatarURL({
                    format: 'png',
                    size: 256
                }))
                .setDescription(
                    `${bot.client.user.username} é o bot oficial do nosso servidor!` +
                    `\nUse **${prefix}**help **<**comando**>** para obter informações detalhadas\ndo comando.\n\n` +
                    [...categories]
                        .map(e => {
                            const emoji = bot.categoriesEmojis.get(e[0]);
                            return `${emoji ? emoji + ' ' : ''}**${e[0]}:**\n**>** ${e[1].map(c => `\`${c}\`${ZeroWidthSpace}`).join('**,** ')}\n`;
                        })
                        .join('\n')
                );

        }

        msg.channel.send(embed);
        
    }
}

module.exports = Help;