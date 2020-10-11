/**
 *      Kevinwkz - 2020/09/19
 */

const { Internals, API, ZeroWidthSpace } = require('../..');
const moment = require('moment-timezone');
const { color, url } = require('./.config.json');

class Schedule extends Internals.Command {
    constructor() {
        super('schedule', {
            description: 'Retorna uma lista de animes em lançamento que são exibidos no dia atual ou selecionado.',
            usage: 'schedule `[dia]` **$** `[página]`',
            aliases: ['programacao'],
            category: 'MyAnimeList',
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {

        const bot = msg.instance;
        
        args = args.join(' ').split(Internals.Constants.PageSeparator);

        const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const weekDaysBR = {
            'segunda': 'monday',
            'terça': 'tuesday',
            'quarta': 'wednesday',
            'quinta': 'thursday',
            'sexta': 'friday',
            'sábado': 'saturday',
            'domingo': 'sunday',
        };

        let day = (args[0] || weekDays[moment().weekday()])
            .toLowerCase()
            .replace(/-feira/g, '');

        day = weekDaysBR[day]
            ? weekDaysBR[day]
            : day;

        msg.channel.startTyping();
        await API.request('GET', url + `schedule/${day}`)
            .then(animes => {
                const results = animes[day];
                const description = results.map(r => 
                    `📘 **Sinopse:** ${r.synopsis}\n\n🔍 [Página da web](${r.url})\n${ZeroWidthSpace}`
                );

                const embedData = results.map(r => {
                    
                    return {
                        title: `${bot.emojis.get('mal')} ${r.title}`,
                        thumbnail: { url: r.image_url },
                        fields: [
                            { name: '📆 Data de Estreia', value: r.airing_start ? moment(r.airing_start).format('DD/MM/YYYY') : '?', inline: true },
                            { name: '📗 Episódios', value: r.episodes || '?', inline: true },
                            { name: '📂 Gêneros', value: r.genres.map(g => g.name), inline: true },
                            { name: '⭐ Pontuação', value: r.score || '?', inline: true },
                            { name: '📕 Categoria', value: r.type, inline: true },
                            { name: '🗃️ Estúdios', value: r.producers.length ? r.producers.map(p => `[${p.name}](${p.url})`) : '?', inline: true },
                            { name: '🗃️ Licenciadores', value: r.licensors.length ? r.licensors : '?', inline: true },
                        ],
                    };
                });

                new Internals.PageEmbed(msg, description, 1, embedData)
                    .setColor(color)
                    .send();

            })
            .catch(async () => {
                await msg.target.send(
                    new Internals.BaseEmbed()
                        .setDescription(`${bot.emojis.get('bot2Cancel')} **Não foi possível realizar esta ação.**`)
                        .setColor(0xF44336)
                );
            })
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = Schedule;