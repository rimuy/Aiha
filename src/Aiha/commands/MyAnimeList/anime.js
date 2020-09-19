/**
 *      Kevinwkz - 2020/09/19
 */

const { Command, PageEmbed, API, ZeroWidthSpace } = require('../..');
const moment = require('moment-timezone');
const { color, url } = require('./.config.json');

class Anime extends Command {
    constructor() {
        super('anime', {
            description: 'Exibe o anime ou uma lista de animes semelhantes ao título inserido.',
            usage: 'anime `<título>` **$** `[página]`',
            category: 'MyAnimeList',
        });
    }

    async run(Bot, msg, args) {
        args = args.join(' ').split('$');

        const anime = args[0];
        const page = Math.max(0, parseInt(args[1] || '0') - 1);

        if (!anime) return;

        msg.channel.startTyping();
        await API.request('GET', url + `search/anime/?q=${anime}`)
            .then(animes => {
                const results = animes.results;
                const description = results.map(r => 
                    `📘 **Sinopse:** ${r.synopsis}\n\n🔍 [Página da web](${r.url})\n${ZeroWidthSpace}`
                );

                const embedData = results.map(r => {
                    
                    const airing =  Date.now() - moment(r.start_date).format('x') < 0
                        ? 'Em Breve'
                        : (
                            !r.airing && r.end_date
                                ? 'Finalizado'
                                : 'Em Lançamento'
                        );
                    
                    return {
                        title: `${Bot.emojis.get('mal')} ${r.title}`,
                        thumbnail: { url: r.image_url },
                        fields: [
                            { name: '📆 Ano', value: moment(r.start_date).format('YYYY'), inline: true },
                            { name: '📗 Episódios', value: r.episodes, inline: true },
                            { name: '⭐ Pontuação', value: r.score, inline: true },
                            { name: '🔴 Status', value: airing, inline: true },
                            { name: '📕 Categoria', value: r.type, inline: true },
                            { name: '🙍 Classificação', value: r.rated, inline: true },
                        ],
                    };
                });

                new PageEmbed(msg, description, 1, page, embedData)
                    .setColor(color)
                    .send();

            })
            .catch()
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = Anime;