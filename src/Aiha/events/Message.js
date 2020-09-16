/**
 *      Kevinwkz - 2020/08/27
 */

const { Event, Server, Developers, MudaeObserver } = require('..');
const { MessageEmbed } = require('discord.js');

const LevelingSystem = require('../lib/LevelingSystem');
const mudae = new MudaeObserver();

const usersOnCooldown = new Map();
const cooldown = 1000;

class MessageEvent extends Event {
    constructor() {
        super({
            event: 'message',
            callback: async (Bot, msg) => {

                const user = msg.author;
                const settings = await Server.Database.request('GET', 'settings');
                const prefix = settings.prefix;

                if (user.bot) return;
                if (!msg.guild || !msg.guild.me.permissionsIn(msg.channel).has('VIEW_CHANNEL')) return;

                /* Mudae Observer */
                const mudaeChannel = settings.mudaeChannel;

                if (mudaeChannel === msg.channel.id) {
                    const props = {
                        claimMembers: [
                            '$mu',
                            '$ku',
                            '$tu',
                        ],
                        rollMembers: [
                            '$w',
                            '$h',
                            '$m',
                        ],
                    }
    
                    Object.keys(props).forEach(key => {
                        if (props[key].some(c => msg.content.toLowerCase().split(' ')[0] === c)) {
                            mudae[key].add(user.id);
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

                        if (
                            (
                                msg.channel.id !== settings.commandsChannel 
                                && msg.channel.id !== settings.testingChannel
                            ) 
                            && (!command.multiChannel && command.category !== 'Moderação')
                        ) return;
                        
                        const userCd = usersOnCooldown.get(user.id);

                        if (userCd && (new Date() - userCd) <= cooldown) {
                            return msg.reply('Não precisa ter pressa.').delete({ timeout: 3000 });
                        }

                        if (
                            ( !command.dev || Developers.includes(user.id) ) &&
                            msg.guild.me.permissionsIn(msg.channel).has(command.botPerms.concat(command.userPerms) || []) &&
                            ( Developers.includes(user.id) || msg.member.permissionsIn(msg.channel).has(command.userPerms || []))
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
                    await LevelingSystem(Bot, msg);
                }

                const r = messagesWithResponses[msg.content.toLowerCase().trim()];

                if (r) {
                    const userCd = usersOnCooldown.get(user.id);
                    if (userCd && (new Date() - userCd) <= cooldown) return;

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