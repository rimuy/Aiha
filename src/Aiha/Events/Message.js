/**
 *      Kevinwkz - 2020/08/27
 */

const { Modules, Internals, Configuration, Server, Util } = require('..');
const { MessageEmbed } = require('discord.js');

const usersOnCooldown = new Map();
const cooldown = 1000;

class MessageEvent extends Internals.Event {
    constructor() {
        super({
            event: 'message',
            callback: async msg => {

                const bot = msg.instance;
                const user = msg.author;
                const settings = await Server.Database.request('GET', 'settings');
                const prefix = settings.prefix;
                const mudaeChannel = settings.mudaeChannel;

                /* Mudae Observer [Claims, Kakera] */
                if (user.bot && user.username.match(/Mudae|Muda(maid|butler)\s?\d*/i)) {
                    const married = msg.content
                        .match(/\*\*(?<user>.+)\*\* and \*\*(?<waifu>.+)\*\* are now married!/s)
                        || msg.content.match(/\*\*(?<user>.+)\*\* e \*\*(?<waifu>.+)\*\* agora são casados!/s);

                    if (married) {
                        const marriedMember = msg.guild.members.cache
                            .find(m => m.user.username === married.groups.user);

                        marriedMember && await Server.Database.request('POST', `mudae/claims/${marriedMember.id}`);
                    }
                    //

                    const collectedKakera = msg.content
                        .match(/\*\*(?<user>.+)\*\* \*\*\+(?<kakera>\d+)\*\* \(\$k\)/s);

                    if (collectedKakera) {
                        const kakeraMember = msg.guild.members.cache
                            .find(m => m.user.username === collectedKakera.groups.user);

                        kakeraMember && await Server.Database.request('POST', `mudae/kakera/${kakeraMember.id}`);
                    }
                }
                //

                if (user.bot) return;
                if (!msg.guild || !msg.guild.me.permissionsIn(msg.channel).has('VIEW_CHANNEL')) return;

                if (await Modules.AntiAds.run(msg)) return;
                if (await Modules.AntiSpam.run(msg)) return;

                /* Mudae Observer [Rolls] */
                if (mudaeChannel === msg.channel.id) {
                    const props = {
                        rolls: msg.content.match(/\$(m|w|h)[ag]+/i)
                            || msg.content.match(/^\$(m|w|h)$/i),
                    };
    
                    Object.keys(props).forEach(async key => {
                        if (props[key]) {
                            await Server.Database.request('POST', `mudae/${key}/${user.id}`);
                        }
                    });
                }
                //

                await Server.Database.request('GET', `users/${user.id}`)
                    .catch(async () => await Server.Database.request('POST', `users/${user.id}`));
                
                if (msg.content.startsWith(prefix)) {

                    const params = msg.content.slice(prefix.length).split(/\s+/g);
                    const cmd = (params.shift() || '');
                    let command = bot.commands.get('name', cmd) || bot.commands.find(c => c.aliases.includes(cmd));

                    /* Collector */
                    if (!command && cmd.length) {

                        await Modules.ResultsCollector.run(cmd, msg)
                            .then(result => {
                                if (result instanceof Internals.Command) {
                                    command = result;
                                }
                            });
                    }

                    if (command) {

                        if ([
                            msg.channel.id !== settings.commandsChannel,
                            msg.channel.id !== settings.testingChannel,
                            !command.multiChannel && command.category !== 'Moderação',
                            !msg.member.permissionsIn(msg.channel).has('ADMINISTRATOR'),
                        ].every(isTrue => isTrue)) return;
                        
                        const userCd = usersOnCooldown.get(user.id);

                        if (userCd && (new Date() - userCd) <= cooldown) {
                            return msg.channel.send(`<@${user.id}> Não precisa ter pressa.`).delete({ timeout: 3000 });
                        }

                        if (
                            ( !command.dev || Configuration.Developers.includes(user.id) ) &&
                            msg.guild.me.permissionsIn(msg.channel).has(command.botPerms.concat(command.userPerms) || []) &&
                            ( Configuration.Developers.includes(user.id) || msg.member.permissionsIn(msg.channel).has(command.userPerms || []))
                        ) { // <-- Exec

                            usersOnCooldown.set(user.id, new Date());

                            const flags = new Util.Flags(
                                msg.content
                                    .slice(prefix.length)
                                    .slice(cmd.length)
                                    .trim()
                            );

                            if (flags.collection.some(f => command.blockFlags.includes(f))) {
                                const blocked = flags.collection
                                    .filter(f => command.blockFlags.includes(f))
                                    .map(f => `\`${Internals.Constants.FLAG_PREFIX}${f}\``)
                                    .join(' ');
                                
                                return msg.channel.send(
                                    new Internals.BaseEmbed()
                                        .setDescription(
                                            `${bot.emojis.get('bot2Cancel')} **Erro ao executar comando**\n\n> **Flags não permitidas:** ${blocked}`
                                        )
                                        .setColor(0xF44336)
                                );
                            }

                            msg.target = msg.channel;

                            const flagFunctions = {
                                double: () => [0, 0].forEach(() => command.run(msg, params, flags)),
                                help: async () => {
                                    await bot.commands.get('name', 'help').run(msg, [command.name], flags);
                                },
                                private: () => msg.target = msg.author,
                                twice: () => new Promise(res => {

                                    let completed = 0;

                                    const exec = async () => {

                                        await command.run(msg, params, flags); 
                                        completed++;

                                        if (completed < 2) 
                                            setTimeout(exec, 1000);
                                        else 
                                            res();
                                    };

                                    exec();
                                }),
                            };

                            const postCommandFunctions = {
                                delete: async () => await msg.delete({ reason: 'Delete Flag' }),
                                mention: async () => await msg.target.send(`<@${user.id}>`).then(m => m.delete({ timeout: 5000 })),
                                ping: async () => {
                                    await msg.target.send(`**Tempo levado:** \`${Date.now() - sendTime}\` ms`).catch(() => []);
                                },
                                private: async () => {
                                    msg && await msg.react(bot.emojis.get('bot2Success')).catch(() => []);
                                }
                            };

                            const sendTime = Date.now();

                            await Promise.all(flags.collection.map(async f => 
                                flagFunctions[f] && await flagFunctions[f]()));

                            if ([
                                !flags.collection.length,
                                Object.keys(postCommandFunctions).some(key => flags.collection.includes(key))
                                && !flags.collection.includes('help'),
                                !flags.collection.some(f => flagFunctions[f] || postCommandFunctions[f]),
                            ].some(isTrue => isTrue)) {
                                await command.run(msg, params, flags);
                            }

                            flags.collection.forEach(async f => 
                                postCommandFunctions[f] && await postCommandFunctions[f]());
                                
                            return;
                        } else { 
                            msg.channel.send(
                                new MessageEmbed()
                                    .setColor(0xF44336)
                                    .setDescription(':person_gesturing_no: **Permissões insuficientes.**')
                            );
                        }

                    }

                    return;
                }

                if (msg.channel.id !== settings.commandsChannel) {
                    await Modules.LevelingSystem.run(msg);
                }

                const r = messagesWithResponses[msg.content.toLowerCase().trim()];

                if (r) {
                    const userCd = usersOnCooldown.get(user.id);
                    if (userCd && (new Date() - userCd) <= 5000) return;

                    usersOnCooldown.set(user.id, new Date());
                    await msg.channel.send(r);
                }

            }
        });
    }
}

const messagesWithResponses = {
    'a': 'b'
};

module.exports = MessageEvent;