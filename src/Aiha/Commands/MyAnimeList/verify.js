/**
 *      Kevinwkz - 2020/09/19
 */

const { Internals, Server, API } = require('../..');
const { color, url } = require('./.config.json');
const Path = require('path');

const imgName = 'example_mal.png';
const imgPath = Path.join(
    __dirname, '..', '..', '..', '..', 'Assets', 'images', imgName
);

const pending = new Map();

class Verify extends Internals.Command {
    constructor() {
        super('verify', {
            description: 'Executa a verificação para vincular o seu perfil do MyAnimeList ao seu usuário.',
            usage: 'verify `<nome do perfil>`',
            category: 'MyAnimeList',
        });
    }

    async run(Bot, msg, args) {
        
        if (pending.has(msg.author.id)) return;

        const username = args[0];
        const embed = new Internals.BaseEmbed();

        if (!username) {
            return msg.channel.send(
                embed
                    .setDescription(`${Bot.emojis.get('bot2Exclamation')} **Indique um nome de usuário válido.**`)
                    .setColor(0xe3c51b)
            );
        }
        
        const status = (await API.request('GET', url + `user/${username}`)).status;

        if (status && status >= 400) {
            return msg.channel.send(
                embed
                    .setDescription(`${Bot.emojis.get('bot2Cancel')} **Perfil não encontrado.**`)
                    .setColor(0xF44336)
            );
        }

        const generatedNumber = Math.floor(Math.random() * 8999) + 1000;
        const maxRequisitions = 7;

        embed
            .setDescription(
                `${Bot.emojis.get('loading2')} **Coloque o número gerado no campo de localização de seu perfil.**\n` + 
                `**Seu código:** \`${generatedNumber}\``
            )
            .attachFiles(imgPath)
            .setImage('attachment://' + imgName)
            .setColor(color);

        pending.set(msg.author.id, true);

        const m = await msg.channel.send(embed);
        let reqs = 0;
        
        const request = async () => {
            reqs++;

            if (reqs >= maxRequisitions) {
                await m.delete();
                pending.delete(msg.author.id);

                return msg.channel.send(
                    new Internals.BaseEmbed()
                        .setDescription('**Tempo esgotado.**')
                        .setColor(color)
                );
            }

            setTimeout(async () => {
                await API.request('GET', `https://myanimelist.net/profile/${username}`, null, 'text')
                    .then(web => {
                        const num = ((web.match(/<span class="user-status-data di-ib fl-r">(\d+?)<\/span>/gs) || [])[0] || '')
                            .replace(/<.*?>(\d+)<.*?>/g, '$1');

                        if (num == generatedNumber) {
                            Server.Database.request('PATCH', `users/${msg.author.id}`, { mal: username })
                                .then(async () => {

                                    await msg.channel.send(
                                        new Internals.BaseEmbed()
                                            .setDescription(
                                                `${Bot.emojis.get('bot2Success')} ` + 
                                                '**A verificação foi completada com sucesso! Use o comando** `profile` **para exibir seu perfil.**'
                                            )
                                            .setColor(color)
                                    );
                                })
                                .catch(async () => {

                                    await msg.channel.send(
                                        new Internals.BaseEmbed()
                                            .setDescription(`${Bot.emojis.get('bot2Cancel')} **Erro ao completar a verificação.**`)
                                            .setColor(0xF44336)
                                    );
                                })
                                .finally(() => {
                                    m.delete();
                                    pending.delete(msg.author.id);
                                });

                            
                        } else {
                            request();
                        }
                    })
                    .catch(async e => {
                        await m.delete();
                        pending.delete(msg.author.id);
                        console.log(e);

                        msg.channel.send(
                            new Internals.BaseEmbed()
                                .setDescription(`${Bot.emojis.get('bot2Cancel')} **Não foi possível realizar a verificação.**`)
                                .setColor(0xF44336)
                        );
                    });
                
            }, 5000);
        };

        request();

    }
}

module.exports = Verify;