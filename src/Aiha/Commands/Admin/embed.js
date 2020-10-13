/**
 *      Kevinwkz - 2020/09/07
 */

const { Internals } = require('../..');

class Embed extends Internals.Command {
    constructor() {
        super('embed', {
            description: 'Constrói um embed com conteúdo (opcional).\n**Embed Builder:** https://embedbuilder.nadekobot.me/',
            usage: 'embed `conteúdo`',
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
            multiChannel: true,
        });
    }

    async run(msg, args) {
        
        const bot = msg.instance;
        await msg.delete().catch(() => false);

        const raw = args.join(' ')
            .replace(/\s+/g, ' ')
            .replace(/'(\w+)':\s*/g, '"$1": ')
            .replace(/(\w+):\s*/g, '"$1": ')
            .replace(/""/g, '"')
            .replace(/'/g, '"')
            .replace(/("\w+"):\s*(\w+)/g, '$1: "$2"')
            .replace(/,\s*]/g, ' ]')
            .replace(/,\s*}/g, ' }')
            //.replace(/("\w+"):\s*'(.+)'/g, '$1: "$2"')
            .replace(/""/g, '"')
            .replace(/{user}/g, msg.author.username)
            .replace(/{userId}/g, msg.author.id)
            .replace(/{tag}/g, msg.author.tag)
            .replace(/{mention}/g, `<@${msg.author.id}>`)
            .replace(/{timestamp}/g, new Date())
            .trim();

        let result; 

        try { 
            result = JSON.parse(raw);
        } catch(e) { 
            result = `${bot.emojis.get('name', 'bot2Cancel')} **Formato de embed inválido.**`;
        } 

        msg.target.send(result);

    }
}

module.exports = Embed;