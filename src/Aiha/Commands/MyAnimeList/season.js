/**
 *      Kevinwkz - 2020/09/19
 */

const { Internals, API, ZeroWidthSpace } = require('../..');
const moment = require('moment-timezone');
const { color, url } = require('./.config.json');

class Season extends Internals.Command {
    constructor() {
        super('season', {
            description: 'Retorna uma lista de animes da temporada do ano atual ou selecionado.',
            usage: 'season `<estação>` `[ano]` **$** `[página]`',
            aliases: ['temporada'],
            category: 'MyAnimeList',
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {

        const bot = msg.instance;

        args = args.join(' ').split(Internals.Constants.PageSeparator);
        const params = args[0].split(' ');

        let season = params[0];
        const year = parseInt(params[1] || moment().format('YYYY'));

        const seasons = new Set()
            .add('summer')
            .add('spring')
            .add('fall')
            .add('winter');

        const seasonsBR = {
            'verão': 'summer',
            'primavera': 'spring',
            'outono': 'fall',
            'inverno': 'winter'
        };

        if (!season) return;
        season = seasonsBR[season.toLowerCase()]
            ? seasonsBR[season.toLowerCase()]
            : season.toLowerCase();

        if (!seasons.has(season)) {
            return msg.target.send(
                new Internals.BaseEmbed()
                    .setDescription(`${bot.emojis.get('name', 'bot2Cancel')} **Estação do ano inválida.**`)
                    .setColor(0xF44336)
            );
        }

        msg.channel.startTyping();
        await API.request('GET', url + `season/${year}/${season}`)
            .then(seasons => {
                const results = seasons.anime;
                const description = results.map(r => 
                    `📘 **Sinopse:** ${r.synopsis}\n\n🔍 [Página da web](${r.url})\n${ZeroWidthSpace}`
                );

                const embedData = results.map(r => {
                    
                    return {
                        title: `${bot.emojis.get('name', 'mal')} ${r.title}`,
                        thumbnail: { url: r.image_url },
                        fields: [
                            { name: '📆 Data de Estreia', value: r.airing_start ? moment(r.airing_start).format('DD/MM/YYYY') : '?', inline: true },
                            { name: '📗 Episódios', value: r.episodes || '?', inline: true },
                            { name: '📂 Gêneros', value: r.genres.map(g => g.name).join('\n'), inline: true },
                            { name: '⭐ Pontuação', value: r.score || '?', inline: true },
                            { name: '📕 Categoria', value: r.type, inline: true },
                            { name: '🗃️ Estúdios', value: r.producers.length ? r.producers.map(p => `[${p.name}](${p.url})`) : '?', inline: true },
                            { name: '➡️ Continuação', value: r.continuing ? 'Sim' : 'Não', inline: true },
                        ],
                    };
                });

                new Internals.PageEmbed(msg, description, 1, embedData)
                    .setColor(color)
                    .send();

            })
            .catch(async () => {
                await msg.channel.send(
                    new Internals.BaseEmbed()
                        .setDescription(`${bot.emojis.get('name', 'bot2Cancel')} **Não foi possível realizar esta ação.**`)
                        .setColor(0xF44336)
                );
            })
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = Season;