/**
 *      Kevinwkz - 2020/09/19
 */

const { Internals, API, ZeroWidthSpace } = require('../..');
const { color, url } = require('./.config.json');

class Character extends Internals.Command {
    constructor() {
        super('character', {
            description: 'Retorna o personagem ou uma lista de personagens com o nome semelhante.',
            usage: 'character `<nome>` **$** `[página]`',
            aliases: ['char', 'personagem'],
            category: 'MyAnimeList',
        });
    }

    async run(Bot, msg, args) {
        args = args.join(' ').split('$');

        const char = args[0];
        const page = Math.max(0, parseInt(args[1] || '0') - 1);

        msg.channel.startTyping();
        await API.request('GET', url + `search/character/?q=${char}`)
            .then(characters => {
                const results = characters.results;
                const description = results.map(r => `🔍 [Página da web](${r.url})\n${ZeroWidthSpace}`);

                const embedData = results.map(r => ({
                    title: `${Bot.emojis.get('mal')} ${r.name}`,
                    thumbnail: { url: r.image_url },
                    fields: [
                        { 
                            name: '📝 Nomes Alternativos', 
                            value: r.alternative_names.slice(0, 7).join('\n') || 'N/A', 
                            inline: true 
                        },
                        { 
                            name: `📘 Animes [${r.anime.length}]`, 
                            value: r.anime.slice(0, 7).map(e => `[${e.name}](${e.url})`).join('\n') || 'N/A', 
                            inline: true 
                        },
                        { 
                            name: `📙 Mangas [${r.manga.length}]`, 
                            value: r.manga.slice(0, 7).map(e => `[${e.name}](${e.url})`).join('\n') || 'N/A', 
                            inline: true 
                        },
                    ],
                }));

                new Internals.PageEmbed(msg, description, 1, page, embedData)
                    .setColor(color)
                    .send();

            })
            .catch(async () => {
                await msg.channel.send(
                    new Internals.BaseEmbed()
                        .setDescription(`${Bot.emojis.get('bot2Cancel')} **Nenhum personagem foi encontrado.**`)
                        .setColor(0xF44336)
                );
            })
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = Character;