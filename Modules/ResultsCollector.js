/* eslint-disable no-case-declarations */
const BaseEmbed = require('../Internals/Structures/BaseEmbed');
const { ZeroWidthSpace, ResultsCollector } = require('../Internals/Contants');

const cache = new Map();

module.exports = async (key, message) => {

    if (cache.has(message.author.id)) return;

    const bot = message.instance;
    const keyMap = bot.commands;
    const aliasesMap = bot.aliases;

    let result;
    const allKeywordMatches = new Set();

    const results = [...keyMap.map(c => c.name)]
        .filter(c => { 

            if (!message.member.hasPermission(keyMap.get(c).userPerms)) return;

            const alreadyMatched = new Set();

            return c.split('').some(s => {
                if (key.includes(s)) {
                    alreadyMatched.add(s);
                    allKeywordMatches.add(s);
                }

                console.log(alreadyMatched.size >= key);
                return alreadyMatched.size >= key.length;
            });
        })
        .sort((a, b) => {
            const regex = new RegExp(key, 'gi');
            const matches = [0, 0];
            
            ([a, b]).forEach((e, i) => {
                matches[i] = (e.match(regex) || []).length;

                e.split('').forEach(s => 
                    key.includes(s) && matches[i]++);

                if (e.startsWith(key)) matches[i] += 3;
            });

            return matches[1] - matches[0]; // matchB - matchA
        });

    results.slice(0, ResultsCollector.MAX_RESULTS || results.length);
    const mostLikely = results[0];

    if (mostLikely) {
        const choices = ['s', 'n'];

        const question = 
            `${bot.emojis.get('bot2QuestionMark')} **Você quis dizer:** \`${mostLikely}\`, **${message.author.username}**? (${choices[0]}/${choices[1].toUpperCase()})`;

        const timeExpired = `${bot.emojis.get('bot2Cancel')} **Tempo esgotado.**`;
        
        cache.set(message.author.id, true);

        /* Choose to execute the command */
        await message.channel.send(question)
            .then(async questionMsg => {

                const filter = m => 
                    choices.some(c => m.content === c.toLowerCase()) &&
                    m.author.id === message.author.id &&
                    m.channel.id === message.channel.id;

                await message.channel.awaitMessages(filter, { max: 1, time: ResultsCollector.TIMEOUT, errors: ['time'] })
                    .then(async collected => {
                        const choice = collected.first();

                        if (!choices.includes(choice.content.toLowerCase())) {
                            await questionMsg.edit(timeExpired);
                            return;
                        }

                        await questionMsg.delete();
                        await choice.react(bot.emojis.get('bot2Success'));
                        
                        switch(choice.content.toLowerCase()) {
                        case choices[0]:
                            result = keyMap.get(mostLikely);
                            if (!result && aliasesMap) result = aliasesMap.get(mostLikely);
                            
                            return;
                        case choices[1]:
                            const bigSpace = (ZeroWidthSpace + ' ').repeat(2);
                            result = 'resultsFound';

                            const insertedChars = {};

                            const embed = new BaseEmbed()
                                .setTitle(`🔎 ${bigSpace}"${key}"`)
                                .setDescription(`${ZeroWidthSpace}\n` + results.map(e => 
                                    `\`${e}\`${bigSpace}-${bigSpace}${
                                        e.split('').map(s => {

                                            if (!insertedChars[e]) insertedChars[e] = [];

                                            if (!insertedChars[e].includes(s) && allKeywordMatches.has(s)) { 
                                                insertedChars[e].push(s);
                                                return `**\`${s}\`**${ZeroWidthSpace}`;
                                            } 

                                            return s;

                                        }).join('')}`
                                ).join('\n'));

                            await message.channel.send(embed);

                            return;
                        }

                    })
                    .catch(() => questionMsg.edit(timeExpired))
                    .finally(() => cache.delete(message.author.id));

            });

        return result;
    }

    return 'notFound';
};