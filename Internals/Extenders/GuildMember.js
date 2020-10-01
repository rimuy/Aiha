const { Structures } = require('discord.js');
const { MuteManager } = require('../../Monitors');

module.exports = Bot => 
    Structures.extend('GuildMember', GuildMember => {
        class AihaGuildMember extends GuildMember {
            constructor(client, data, guild) {
                super(client, data, guild);
                this.instance = Bot;
            }

            get mention() {
                return `<@${this.id}>`;
            }

            get pageEmbed() {
                return this.guild.instance.pageEmbeds.get(this.id);
            }

            set pageEmbed(value) {
                this.guild.instance.pageEmbeds.set(this.id, value);
            }

            async mute(options) {
                return MuteManager.add(this.id, {
                    ...options,
                    guild: this.guild.id,
                });
            }

            async unmute(reason, moderator) {
                return MuteManager.delete(this.id, reason, moderator);
            }
        }
    
        return AihaGuildMember;
    });