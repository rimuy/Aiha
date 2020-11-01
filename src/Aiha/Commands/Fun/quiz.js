/**
 *      Kevinwkz - 2020/10/19
 */

const { Internals, ZeroWidthSpace, Configuration } = require('../..');
const { color } = require('./.config.json');
const { MessageEmbed, MessageCollector, ReactionCollector, Util } = require('discord.js');
const quiz = Configuration.Quiz;

const last5 = [];
const leaderboard = [];
var locked;

class Quiz extends Internals.Command {
    constructor() {
        super('quiz', {
            description: '🔮 ',
            usage: 'quiz',
            category: 'Diversão',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['MANAGE_MESSAGES'],
            blockFlags: ['double', 'private', 'twice'],
            multiChannel: true,
        });
    }

    async run(msg) {
        const bot = msg.instance;

        if (locked) {
            return await msg.channel.send(
                new Internals.BaseEmbed()
                    .setDescription(`${bot.emojis.get('name', 'bot2Exclamation')} **Já existe um quiz em andamento.**`)
                    .setColor(Internals.BaseEmbed.warningColor)
            );
        }

        const { channel } = msg;

        /* ------------------------ Configuration ------------------------ */

        let categories = [];
        let selected = 0;
        let started;
        let canceled;

        const presets = {
            'Limite de Pontos': { 
                value: 100, 
                format: v => {
                    const diff = 5;
                    const int = parseInt(v);
                    const eq = int - (int % diff);

                    return Math.max(diff, int - eq <= 2.5 ? eq : eq + diff);
                }
            },
            'Perguntas': { value: 30, format: v => Math.max(10, parseInt(v)) },
            'Categorias': { 
                value: ['Todas'], 
                format: v => {
                    const choosed = [...new Set(v.split(','))];
                    categories = quiz.game
                        .filter(q => choosed.some(s => s.toLowerCase() === q.name.toLowerCase()))
                        .map(q => q.name);

                    return categories.length ? categories : ['Todas'];
                }
            },
        };

        const configQuestions = [
            {
                q: 'Defina o número de questões do quiz.',
                key: 'Perguntas',
            },
            {
                q: 'Qual será a pontuação máxima?',
                key: 'Limite de Pontos',
            },
            {
                q: `Quais categorias estarão habilitadas para o quiz?\n**Lista de Categorias: [**${quiz.game.map(e => e.name).join(', ')}**]**`,
                key: 'Categorias',
            },
        ];
        
        const configEmbed = new MessageEmbed()
            .setColor(color);

        let configContent = {};

        const updateContent = () => {
            configEmbed.fields = Object.keys(presets)
                .map((key, i) => ({ 
                    name: `${selected === i ? '▶️' + (' ' + ZeroWidthSpace).repeat(4) : ''}` + key, 
                    value: typeof presets[key].value === 'object' ? presets[key].value.map(v => `\`${v.trim()}\``).join(' ') : presets[key].value
                }));

            configContent = {
                content: 
                    `${bot.emojis.get('name', 'bot2Confirm')} **Digite** \`start\` **para começar, ou** \`cancel\` **para cancelar este quiz.**\n` +
                    `${bot.emojis.get('name', 'bot2QuestionMark')} **Use as reactions para selecionar as configurações.**\n\n` +
                    `${configQuestions.find(c => c.key === Object.keys(presets)[selected]).q}` + 
                    `\n${ZeroWidthSpace}`,
                embed: configEmbed,
            };
        };

        updateContent();

        await channel.send(configContent)
            .then(async configMsg => {

                await configMsg.react('⬆️')
                    .then(async () => await configMsg.react('⬇️'))
                    .catch(console.log);

                locked = true;

                const time = 60000;
                const startTime = Date.now();

                const messageCollector = new MessageCollector(channel, m => m.author.equals(msg.author));
                const reactionCollector = new ReactionCollector(configMsg, (_, user) => user.equals(msg.author), {
                    time,
                });

                const manager = {
                    '⬆️': () => selected - 1,
                    '⬇️': () => selected + 1,
                };

                reactionCollector.on('collect', async reaction => {
                    let newIndex = manager[reaction.emoji.name]() || 0;

                    if (newIndex < 0) newIndex = configEmbed.fields.length - 1;
                    else if (newIndex >= configEmbed.fields.length) newIndex = 0;

                    selected = newIndex;

                    Date.now() - startTime >= time / 2 && 
                        reactionCollector.resetTimer({ time: time / 2 });

                    if (!channel.isText()) return;

                    reaction.users.cache.forEach(async user => 
                        !user.equals(configMsg.author) && await reaction.users.remove(user.id));

                    updateContent();
                    await configMsg.edit(configContent);

                });

                reactionCollector.on('end', async () => {
                    messageCollector.stop();
                    await configMsg.delete();

                    if (!started) {
                        await channel.send(`${bot.emojis.get('name', 'bot2Cancel')} **${canceled ? 'Partida cancelada' : 'Tempo esgotado'}.**`);
                        locked = false;
                    }
                });

                messageCollector.on('collect', async message => {
                    let { content } = message;
                    if (!content) return;

                    content = content.trim();

                    /* eslint-disable indent */
                    switch(content.toLowerCase()) {
                        case 'start':
                            started = true;
                            reactionCollector.stop();
    
                            QuizRound();
                            return;
                        case 'cancel':
                            canceled = true;
                            reactionCollector.stop();

                            return;
                    }
                    /* eslint-enable indent */

                    Date.now() - startTime >= time / 2 && 
                        reactionCollector.resetTimer({ time: time / 2 });

                    const obj = presets[Object.keys(presets)[selected]];
                    obj.value = obj.format(content) ? obj.format(content) : obj.value;

                    updateContent();
                    await configMsg.edit(configContent);
                });

                
            })
            .catch(console.log);

        /* ------------------------ Game ------------------------ */

        let round = 1; // Round
        let currentCollector;

        const QuizRound = async () => {

            let roundWinner;
            let cancelMsg;

            if (round === 1) {
                await channel.send(`${bot.emojis.get('name', 'bot2Success')} **O Quiz começou, digite** \`end\` **para encerra-lo a qualquer momento.**`);

                new MessageCollector(
                    channel, 
                    m => m.member.permissionsIn(channel).has(this.userPerms) && m.content.trim().toLowerCase() === 'end', 
                    { max: 1 },
                )
                    .on('collect', async () => {
                        cancelMsg = await channel.send(`${bot.emojis.get('name', 'loading2')} **Cancelando partida, aguarde ...**`);
                        canceled = true;

                        currentCollector && currentCollector.stop();
                    });

                await Util.delayFor(5000);
            }

            const Canceled = async () => {
                if (canceled) return await Cancel(cancelMsg);
            };

            if (await Canceled()) return;
            
            const Categories = quiz.game
                .filter(c => !categories.length || categories.includes(c.name))
                .map(c => ({ name: c.name, items: c.items }));

            const filteredCategories = [];

            Categories.forEach(c => {
                
                if (c.items.some(q => !last5.includes(q.question)))
                    filteredCategories.push({ 
                        name: c.name, 
                        items: c.items.filter(q => !last5.includes(q.question))
                    });
          
            });

            const indexes = filteredCategories.map(c => quiz.game.map(q => q.name).indexOf(c.name));
            const categoryN = indexes[Math.floor(Math.random() * indexes.length)];
            const index = filteredCategories.findIndex(c => quiz.game.some(q => q.name === c.name));

            await channel.send(`${bot.emojis.get('name', 'bot2Confirm')} **Pergunta** \`${round}\`${
                (' ' + ZeroWidthSpace).repeat(2)
            }|${
                (' ' + ZeroWidthSpace).repeat(2)
            }**Tema:**${
                (' ' + ZeroWidthSpace).repeat(2)
            }${
                quiz.emojis[Object.keys(quiz.emojis)[categoryN]]
            } ${
                quiz.game.map(q => q.name)[categoryN]
            }`);

            await Util.delayFor(3000);

            if (await Canceled()) return;

            const questions = filteredCategories[index].items;
            const q = questions[Math.floor(Math.random() * questions.length)];

            await channel.send(`${bot.emojis.get('name', 'bot2QuestionMark')} ${q.question}`)
                .then(async () => {
                    if (await Canceled()) return;

                    last5.push(q.question);
                    if (last5.length > 5) last5.shift();

                    const collector = new MessageCollector(channel, m => !m.bot, { time: 60000 });
                    currentCollector = collector;

                    collector.on('collect', message => {
                        const { author, content } = message;
                        if (!content) return;

                        if (!leaderboard.find(u => u.id === author.id)) {
                            leaderboard.push({
                                id: author.id,
                                user: author,
                                points: 0,
                            });
                        }

                        if (content.trim().toLowerCase() === q.response.toLowerCase()) {
                            roundWinner = author;
                            collector.stop();
                        }
                    });

                    collector.on('end', async collected => {
                        currentCollector = null;
                        if (await Canceled()) return;

                        if (!collected.size) {
                            await channel.send(`${bot.emojis.get('name', 'bot2Cancel')} **O Quiz foi encerrado por inatividade.**`);
                            Reset();
                            return;
                        }

                        if (roundWinner) {

                            const obj = leaderboard.find(u => u.id === roundWinner.id);
                            obj.points += 5;

                        } else await channel.send(`${bot.emojis.get('name', 'bot2Cancel')} **Não houve acertos, partindo para a próxima pergunta.**`);

                        /* Winner */
                        if (
                            round >= presets['Perguntas'].value 
                            || leaderboard.some(u => u.points >= presets['Limite de Pontos'].value)
                        ) {
                            const winner = leaderboard.sort((a, b) => b.points - a.points)[0];

                            await channel.send(`${bot.emojis.get('name', 'bot2Success')} **Partida encerrada, o vencedor é ${winner.user.mention}!** 🎉`);
                            Reset();
                            return;
                        }

                        roundWinner && await channel.send(`${bot.emojis.get('name', 'bot2Success')} **${roundWinner.mention} acertou!, partindo para a próxima pergunta.**`);
                        await Util.delayFor(3000);

                        round++;
                        QuizRound();
                    });

                })
                .catch(Reset);

        };
       
    }
}

async function Cancel(msg) {
    msg && await msg.edit(`${msg.instance.emojis.get('name', 'bot2Success')} **Partida cancelada.**`);
    Reset();

    return true;
}

function Reset() {
    /* eslint-disable no-unused-vars */
    for (const _ in last5) last5.pop();
    for (const _ in leaderboard) leaderboard.pop();
    /* eslint-enable no-unused-vars */
    locked = false;
}

module.exports = Quiz;