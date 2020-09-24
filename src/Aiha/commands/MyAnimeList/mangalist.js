/**
 *      Kevinwkz - 2020/09/20
 */

const { Internals, Server, API, ZeroWidthSpace } = require('../..');

const moment = require('moment-timezone');
const { color, url } = require('./.config.json');

class MangaList extends Internals.Command {
    constructor() {
        super('mangalist', {
            description: 'Exibe sua lista de mangás da MyAnimeList ou a do usuário mencionado.',
            usage: 'mangalist `[nome do perfil]` **$** `[página]`',
            category: 'MyAnimeList',
        });
    }

    async run(Bot, msg, args) {
        
        args = args.join(' ').split('$');
        const mention = msg.mentions.users.first();

        const user = mention 
            ? (await Server.Database.request('GET', `users/${mention.id}`)).mal // Mention
            : (
                args[0] // ID or string
            ) || (await Server.Database.request('GET', `users/${msg.author.id}`)).mal; // Own

        const page = Math.max(0, parseInt(args[1] || '0') - 1);

        msg.channel.startTyping();
        await API.request('GET', url + `user/${user}/mangalist`)
            .then(u => {

                const mangas = u.manga;

                const status = [
                    0, 
                    'Lendo', 'Completo', 'Em espera', 'Dropado', 
                    0, 
                    'Planeja ler'
                ];
                
                const embedData = mangas.map(r => ({
                    title: `${Bot.emojis.get('mal')} ${r.title}`,
                    description: `🔍 [Página da lista](https://myanimelist.net/mangalist/${user})\n` +
                        `🔍 [Página do mangá](${r.url})\n${ZeroWidthSpace}`,
                    thumbnail: { url: r.image_url },
                    fields: [
                        { 
                            name: '📘 Mangás Lidos', 
                            value: `**Capítulos:** ${r.read_chapters}/${r.total_chapters || '???'}\n` +
                                `**Volumes:** ${r.read_volumes}/${r.total_volumes || '???'}\n`, 
                            inline: true 
                        },
                        { 
                            name: '⭐ Avaliação', 
                            value: r.score, 
                            inline: true 
                        },
                        { 
                            name: '🌐 Status', 
                            value: status[r.reading_status] || '?', 
                            inline: true 
                        },
                        { 
                            name: '📕 Categoria', 
                            value: r.type, 
                            inline: true 
                        },
                        { 
                            name: '🔖 Começou a ler', 
                            value: r.read_start_date ? moment(r.read_start_date).format('DD/MM/YYYY') : '?', 
                            inline: true 
                        },
                        { 
                            name: '📆 Terminou', 
                            value: r.read_end_date ? moment(r.read_end_date).format('DD/MM/YYYY') : '?', 
                            inline: true 
                        },
                    ],
                }));

                new Internals.PageEmbed(msg, mangas.map(() => ZeroWidthSpace), 1, page, embedData)
                    .setColor(color)
                    .send();

            })
            .catch(async e => {
                console.log(e);

                await msg.channel.send(
                    new Internals.BaseEmbed()
                        .setDescription(`${Bot.emojis.get('bot2Cancel')} **Usuário inválido.**`)
                        .setColor(0xF44336)
                );
            })
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = MangaList;