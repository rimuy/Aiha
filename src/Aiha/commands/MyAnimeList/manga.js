/**
 *      Kevinwkz - 2020/09/19
 */

const { Command, PageEmbed, API, ZeroWidthSpace } = require('../..');
const moment = require('moment-timezone');
const { color, url } = require('./.config.json');

class Manga extends Command {
    constructor() {
        super('manga', {
            description: 'Exibe o mangá ou uma lista de mangás semelhantes ao título inserido.',
            usage: 'manga `<título>` **$** `[página]`',
            category: 'MyAnimeList',
        });
    }

    async run(Bot, msg, args) {
        args = args.join(' ').split('$');

        const manga = args[0];
        const page = Math.max(0, parseInt(args[1] || '0') - 1);

        if (!manga) return;

        msg.channel.startTyping();
        await API.request('GET', url + `search/manga/?q=${manga}`)
            .then(mangas => {
                const results = mangas.results;
                const description = results.map(r => 
                    `📘 **Sinopse:** ${r.synopsis}\n\n🔍 [Página da web](${r.url})\n${ZeroWidthSpace}`
                );

                const embedData = results.map(r => { 

                    const publishing = Date.now() - moment(r.start_date).format('x') < 0
                        ? 'Em Breve'
                        : (
                            !r.publishing && r.end_date
                                ? 'Finalizado'
                                : 'Em Lançamento'
                        );

                    return {
                        title: `${Bot.emojis.get('mal')} ${r.title}`,
                        thumbnail: { url: r.image_url },
                        fields: [
                            { name: '📆 Ano', value: moment(r.start_date).format('YYYY'), inline: true },
                            { name: '📗 Capítulos', value: r.chapters, inline: true },
                            { name: '⭐ Pontuação', value: r.score, inline: true },
                            { name: '🔴 Status', value: publishing, inline: true },
                            { name: '📕 Volumes', value: r.volumes, inline: true },
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

module.exports = Manga;