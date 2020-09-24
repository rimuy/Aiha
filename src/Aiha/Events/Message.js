/**
 *      Kevinwkz - 2020/08/27
 */

const { Modules, Internals, Configuration, Server } = require('..');
const { MessageEmbed } = require('discord.js');

const usersOnCooldown = new Map();
const cooldown = 1000;

class MessageEvent extends Internals.Event {
    constructor() {
        super({
            event: 'message',
            callback: async (Bot, msg) => {

                const user = msg.author;
                const settings = await Server.Database.request('GET', 'settings');
                const prefix = settings.prefix;
                const mudaeChannel = settings.mudaeChannel;

                /* Mudae Observer [Claims] */
                const married = msg.content
                    .match(/\*\*(?<user>.+)\*\* and \*\*(?<waifu>.+)\*\* are now married!/s)
                    || msg.content.match(/\*\*(?<user>.+)\*\* e \*\*(?<waifu>.+)\*\* agora são casados!/s);

                if ([
                    user.bot,
                    user.username.match(/Mudae|Muda(maid|butler)\s?\d*/),
                    married,
                ].every(isTrue => isTrue)) {
                    const marriedMember = msg.guild.members.cache
                        .find(m => m.user.username === married.groups.user);

                    marriedMember && await Server.Database.request('POST', `mudae/claims/${marriedMember.id}`);
                }
                //

                if (user.bot) return;
                if (!msg.guild || !msg.guild.me.permissionsIn(msg.channel).has('VIEW_CHANNEL')) return;

                if (await Modules.AntiAds(msg)) return;
                if (await Modules.AntiSpam(msg)) return;

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

                    const args = msg.content.slice(prefix.length).split(/\s+/g);
                    const cmd = (args.shift() || '').toLowerCase();
                    const command = Bot.commands.get(cmd) || Bot.aliases.get(cmd);

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

                            return await command.run(Bot, msg, args);
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
                    await Modules.LevelingSystem(Bot, msg);
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