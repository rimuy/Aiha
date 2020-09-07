/**
 *      Kevinwkz - 2020/08/27
 */

const { Event, Developers } = require('..');
const { MessageEmbed } = require('discord.js');

const LevelingSystem = require('../lib/LevelingSystem');

const prefix = process.env.PREFIX;

const usersOnCooldown = new Map();
const cooldown = 1000;

class MessageEvent extends Event {
    constructor() {
        super({
            event: 'message',
            callback: async (Bot, msg) => {

                const user = msg.author;

                if (user.bot) return;
                if (!msg.guild.me.permissionsIn(msg.channel).has('VIEW_CHANNEL')) return;

                if (!(await Bot.server.request('GET', `users/${user.id}`))) {
                    await Bot.server.request('POST', `users/${user.id}`);
                }
                
                if (msg.content.startsWith(prefix)) {

                    const args = msg.content.slice(prefix.length).split(/\s+/g);
                    const cmd = (args.shift() || '').toLowerCase();
                    const command = Bot.commands.get(cmd) || Bot.aliases.get(cmd);

                    if (command) {
                        
                        const userCd = usersOnCooldown.get(user.id);

                        if (userCd && (new Date() - userCd) <= cooldown) {
                            return msg.reply('Não precisa ter pressa.');
                        }

                        if (
                            ( !command.dev || Developers.includes(user.id) ) &&
                            msg.guild.me.permissionsIn(msg.channel).has(command.botPerms.concat(command.userPerms) || []) &&
                            msg.member.permissionsIn(msg.channel).has(command.userPerms || [])
                        ) { // <-- Exec
    
                            usersOnCooldown.set(user.id, new Date());

                            return await command.run(Bot, msg, args);
                        } else { 
                            msg.channel.send(
                                new MessageEmbed()
                                    .setColor(0xF44336)
                                    .setDescription(`:person_gesturing_no: **Permissões insuficientes.**`)
                            );
                        }

                    }

                    return;
                }

                await LevelingSystem(Bot, msg);

                const r = messagesWithResponses[msg.content.toLowerCase().trim()];
                if (r) return msg.channel.send(r);
            }
        });
    }
}

const messagesWithResponses = {
    "a": "b"
}

module.exports = MessageEvent;