/**
 *      Kevinwkz - 2020/08/28
 */

const { Command, BaseEmbed } = require('../..');

class Help extends Command {
    constructor() {
        super('help', {
            description: 'Retorna a lista de comandos do bot, ou informações sobre um comando específico.',
            usage: 'help `[comando]`',
            aliases: ['h', 'hawp', 'ajuda'],
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    async run(Bot, msg, args) {
        
        let cmd = (args[0] || '').toLowerCase();

        const categories = new Map();
        const command = Bot.commands.get(cmd) || Bot.aliases.get(cmd);
        const prefix = (await Bot.server.request('GET', 'settings')).prefix;

        const embed = new BaseEmbed()
            .setFooter(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }));

        Bot.commands.forEach(c => {
            if(c.category && !c.hidden) {
                const arr = categories.get(c.category);

                arr
                ? arr.push(c.name)
                : categories.set(c.category, [c.name]);
            }
        });
        
        if (command) {

            const info = {
                "name": "Nome",
                "description": "Descrição",
                "usage": "Modo de uso",
                "aliases": "Aliases",
                "userPerms": "Permissões",
            }
            
            const format = {
                "name": '`{}`',
                "usage": `${prefix}{}`,
                "aliases": '`{}`',
                "userPerms": "`{}`",
            }

            embed
                .setAuthor('Informações do Comando', Bot.client.user.displayAvatarURL())
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
                            }`
                        })
                        .join('\n')
                );
        } else {

            embed
                .setTitle('Lista de Comandos')
                .setThumbnail(Bot.client.user.displayAvatarURL({
                    format: 'png',
                    size: 256
                }))
                .setDescription(
                    `${Bot.client.user.username} é o bot oficial do nosso servidor!` +
                    `\nUse **${prefix}**help **<**comando**>** para obter informações detalhadas\ndo comando.\n\n` +
                    [...categories]
                    .map(e => {
                        const emoji = Bot.categoriesEmojis.get(e[0]);
                        return `${emoji ? emoji + ' ' : ''}**${e[0]}:**\n**>** ${e[1].map(c => `\`${c}\``).join('**,** ')}\n`
                    })
                    .join('\n')
                );

        }

        msg.channel.send(embed);
        
    }
}

module.exports = Help;