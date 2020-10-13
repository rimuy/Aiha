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
            blockFlags: ['double', 'twice'],
        });
    }

    async run(msg, args) {

        const bot = msg.instance;

        args = args.join(' ').split(Internals.Constants.PageSeparator);

        const char = args[0];

        msg.channel.startTyping();
        await API.request('GET', url + `search/character/?q=${char}`)
            .then(characters => {
                const results = characters.results;
                const description = results.map(r => `🔍 [Página da web](${r.url})\n${ZeroWidthSpace}`);

                const embedData = results.map(r => ({
                    title: `${bot.emojis.get('name', 'mal')} ${r.name}`,
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

                new Internals.PageEmbed(msg, description, 1, embedData)
                    .setColor(color)
                    .send();

            })
            .catch(async () => {
                await msg.target.send(
                    new Internals.BaseEmbed()
                        .setDescription(`${bot.emojis.get('name', 'bot2Cancel')} **Nenhum personagem foi encontrado.**`)
                        .setColor(0xF44336)
                );
            })
            .finally(() => msg.channel.stopTyping());

    }
}

module.exports = Character;