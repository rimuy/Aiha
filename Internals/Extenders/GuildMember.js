const { Structures } = require('discord.js');
const { MuteManager } = require('../../Monitors');

module.exports = () => 
    Structures.extend('GuildMember', GuildMember => {
        class AihaGuildMember extends GuildMember {
            constructor(client, data, guild) {
                super(client, data, guild);
            }

            get mention() {
                return `<@${this.id}>`;
            }

            get pageEmbed() {
                return this.guild.Instance.pageEmbeds.get(this.id);
            }

            set pageEmbed(value) {
                this.guild.Instance.pageEmbeds.set(this.id, value);
            }

            async mute(options) {
                return MuteManager.add(this.id, {
                    ...options,
                    guild: this.guild.id,
                });
            }

            async unmute() {
                return MuteManager.delete(this.id);
            }
        }
    
        return AihaGuildMember;
    });