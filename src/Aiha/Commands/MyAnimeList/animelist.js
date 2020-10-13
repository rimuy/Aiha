/**
 *      Kevinwkz - 2020/09/20
 */

const { Internals, Server, API, ZeroWidthSpace } = require('../..');

const moment = require('moment-timezone');
const { color, url } = require('./.config.json');

class AnimeList extends Internals.Command {
    constructor() {
        super('animelist', {
            description: 'Exibe sua lista de animes da MyAnimeList ou a do usuário mencionado.',
            usage: 'animelist `[nome do perfil]` **$** `[página]`',
            category: 'MyAnimeList',
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {
        
        const bot = msg.instance;

        args = args.join(' ').split(Internals.Constants.PageSeparator);
        const mention = msg.mentions.users.first();

        const user = mention 
            ? (await Server.Database.request('GET', `users/${mention.id}`)).mal // Mention
            : (
                args[0] // ID or string
            ) || (await Server.Database.request('GET', `users/${msg.author.id}`)).mal; // Own

        msg.channel.startTyping();
        await API.request('GET', url + `user/${user}/animelist`)
            .then(u => {

                const animes = u.anime;

                const status = [
                    0, 
                    'Assistindo', 'Completo', 'Em espera', 'Dropado', 
                    0, 
                    'Planeja assistir'
                ];
                
                const embedData = animes.map(r => ({
                    title: `${bot.emojis.get('name', 'mal')} ${r.title}`,
                    description: `🔍 [Página da lista](https://myanimelist.net/animelist/${user})\n` +
                        `🔍 [Página do anime](${r.url})\n${ZeroWidthSpace}`,
                    thumbnail: { url: r.image_url },
                    fields: [
                        { 
                            name: '📘 Episódios Assistidos', 
                            value: `${r.watched_episodes}/${r.total_episodes || '???'}`, 
                            inline: true 
                        },
                        { 
                            name: '⭐ Avaliação', 
                            value: r.score, 
                            inline: true 
                        },
                        { 
                            name: '🌐 Status', 
                            value: status[r.watching_status] || '?', 
                            inline: true 
                        },
                        { 
                            name: '📕 Categoria', 
                            value: r.type, 
                            inline: true 
                        },
                        { 
                            name: '🖥️ Começou a assistir', 
                            value: r.watch_start_date ? moment(r.watch_start_date).format('DD/MM/YYYY') : '?', 
                            inline: true 
                        },
                        { 
                            name: '📆 Terminou', 
                            value: r.watch_end_date ? moment(r.watch_end_date).format('DD/MM/YYYY') : '?', 
                            inline: true 
                        },
                    ],
                }));

                new Internals.PageEmbed(msg, animes.map(() => ZeroWidthSpace), 1, embedData)
                    .setColor(color)
                    .send();

            })
            .catch(async e => {
                console.log(e);

                await msg.target.send(
                    new Internals.BaseEmbed()
                        .setDescription(`${bot.emojis.get('name', 'bot2Cancel')} **Usuário inválido.**`)
                        .setColor(0xF44336)
                );
            })
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = AnimeList;