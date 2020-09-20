/**
 *      Kevinwkz - 2020/09/20
 */

const { 
    Command, PageEmbed, BaseEmbed, 
    Server, API, ZeroWidthSpace 
} = require('../..');

const moment = require('moment-timezone');
const { color, url } = require('./.config.json');

class Profile extends Command {
    constructor() {
        super('profile', {
            description: 'Exibe seu perfil da MyAnimeList ou o do usuário mencionado.',
            usage: 'profile `[nome]` **$** `[página]`',
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

        const genders = {
            'Male': 'Masculino',
            'Female': 'Feminino',
        };

        msg.channel.startTyping();
        await API.request('GET', url + `user/${user}`)
            .then(async u => {

                let friendList = await API.request('GET', url + `user/${user}/friends`)
                    .then(res => res.friends);
                friendList = friendList || [];

                const friends = [];
                let p = -1;

                friendList.forEach((friend, i) => {
                    if (!(i % 10)) friends[++p] = { 
                        name: ZeroWidthSpace, 
                        value: '', 
                        inline: true,
                    };

                    friends[p].value += `👤 [${friend.username}](${friend.url})\n`;
                });

                const animeUpdates = await API.request('GET', url + `user/${user}/history/anime`)
                    .then(res => res.history);
                const mangaUpdates = await API.request('GET', url + `user/${user}/history/manga`)
                    .then(res => res.history);

                const cached = new Set();
                const history = [];
                animeUpdates.concat(mangaUpdates).forEach(e => {
                    if (!cached.has(e.meta.name)) {
                        cached.add(e.meta.name);
                        history.push(e);
                    }
                });
                
                const animeStats = {
                    'mean_score': 'Pontuação média',
                    'watching': 'Assistindo',
                    'completed': 'Completo',
                    'on_hold': 'Em espera',
                    'dropped': 'Dropado',
                    'plan_to_watch': 'Planejando assistir',
                    'total_entries': 'Resultados',
                    'rewatched': 'Re-assistidos',
                    'episodes_watched': 'Total de episódios', 
                };

                const mangaStats = {
                    'mean_score': 'Pontuação média',
                    'reading': 'Lendo',
                    'completed': 'Completo',
                    'on_hold': 'Em espera',
                    'dropped': 'Dropado',
                    'plan_to_read': 'Planejando ler',
                    'total_entries': 'Resultados',
                    'reread': 'Re-lidos',
                    'chapters_read': 'Capítulos lidos',
                    'volumes_read': 'Volumes lidos',
                };
        
                const maxDescription = 800;
                const embedData = [
                    // 1
                    {
                        title: `${Bot.emojis.get('mal')} ${u.username}`,
                        description: `🔍 [Página da web](${u.url})\n\n📘 **Descrição**\n\n${
                            u.about 
                                ? u.about
                                    .replace(/<(.+?)>/g, '')
                                    .trim()
                                    .slice(0, maxDescription)
                                : ZeroWidthSpace
                                
                        }${u.about && u.about.length > maxDescription ? '...' : ''}\n${ZeroWidthSpace}`,
                        thumbnail: { url: u.image_url },
                        fields: [
                            { 
                                name: '📋 ID', 
                                value: u.user_id, 
                                inline: true },
                            { 
                                name: 'ℹ️ Gênero', 
                                value: u.gender && genders[u.gender] ? genders[u.gender] : 'Não Especificado', 
                                inline: true 
                            },
                            { 
                                name: '🎂 Aniversário', 
                                value: u.birthday ? moment(u.birthday).add(3, 'hours').format('DD/MM/YYYY') : '?', 
                                inline: true 
                            },
                            { 
                                name: '🔍 Localização', 
                                value: u.location || '?', 
                                inline: true 
                            },
                            { 
                                name: '📆 Data de Criação', 
                                value: moment(u.joined).format('DD/MM/YYYY hh:mm'), 
                                inline: true },
                            { 
                                name: '🖥️ Última Conexão', 
                                value: moment(u.last_online).format('DD/MM/YYYY hh:mm'), 
                                inline: true 
                            },
                        ],
                    },
                    // 2
                    {
                        title: `${Bot.emojis.get('mal')} ${u.username}`,
                        description: `📕 **Status**\n${ZeroWidthSpace}`,
                        thumbnail: { url: u.image_url },
                        fields: [
                            { 
                                name: 'Anime', 
                                value: Object.keys(u.anime_stats)
                                    .filter(key => animeStats[key])
                                    .map(key => `\`${animeStats[key]}\` **${u.anime_stats[key]}**`), 
                                inline: true 
                            },
                            { 
                                name: 'Mangá', 
                                value: Object.keys(u.manga_stats)
                                    .filter(key => mangaStats[key])
                                    .map(key => `\`${mangaStats[key]}\` **${u.manga_stats[key]}**`), 
                                inline: true 
                            },
                            { 
                                name: 'Histórico', 
                                value: history.length ? history
                                    .slice(0, 4)
                                    .map(e => 
                                        `> [ **Título:** [${e.meta.name}](${e.meta.url}) ]\n` +
                                        `> [ **Finalizado:** ${e.increment} ]\n` +
                                        `> [ **Data:** ${moment(e.date).format('hh:mm DD/MM/YYYY')} ]`
                                    ).join(`\n> ${ZeroWidthSpace}\n`) : 'N/A', 
                                inline: true 
                            },
                        ],
                    },
                    // 3
                    {
                        title: `${Bot.emojis.get('mal')} ${u.username}`,
                        description: `📗 **Ranking**\n${ZeroWidthSpace}`,
                        thumbnail: { url: u.image_url },
                        fields: [
                            { 
                                name: 'Top Animes', 
                                value: u.favorites.anime.length 
                                    ? u.favorites.anime.slice(0, 10).map(a => `[${a.name}](${a.url})`) 
                                    : 'N/A', 
                                inline: true 
                            },
                            { 
                                name: 'Top Mangás', 
                                value: u.favorites.manga.length
                                    ? u.favorites.manga.slice(0, 10).map(a => `[${a.name}](${a.url})`) 
                                    : 'N/A', 
                                inline: true 
                            },
                            { 
                                name: 'Top Personagens', 
                                value: u.favorites.characters.length 
                                    ? u.favorites.characters.slice(0, 10).map(a => `[${a.name}](${a.url})`) 
                                    : 'N/A', 
                                inline: true 
                            },
                        ],
                    },
                    // 4
                    {
                        title: `${Bot.emojis.get('mal')} ${u.username}`,
                        description: `📙 **Lista de Amigos**${
                            !friendList.length ? `\n\n${u.username} não possui amigos.` : ''
                        }`,
                        thumbnail: { url: u.image_url },
                        fields: friends.slice(0, 6),
                    },
                ];

                new PageEmbed(msg, embedData.map(() => ZeroWidthSpace), 1, page, embedData)
                    .setColor(color)
                    .send();

            })
            .catch(async e => {
                console.log(e);

                await msg.channel.send(
                    new BaseEmbed()
                        .setDescription(`${Bot.emojis.get('bot2Cancel')} **Usuário inválido.**`)
                        .setColor(0xF44336)
                );
            })
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = Profile;