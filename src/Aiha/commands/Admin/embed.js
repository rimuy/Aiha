/**
 *      Kevinwkz - 2020/09/07
 */

const { Command } = require('../..');

class Embed extends Command {
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

    run(Bot, msg, args) {
        
        msg.delete().catch(() => {});

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
            result = `${Bot.emojis.get('bot2Cancel')} **Formato de embed inválido.**`;
        } 

        msg.channel.send(result);

    }
}

module.exports = Embed;