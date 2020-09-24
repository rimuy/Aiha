/**
 *      Kevinwkz - 2020/08/27
 */

const { Internals } = require('../..');

class Avatar extends Internals.Command {
    constructor() {
        super('avatar', {
            description: 'Exibe o avatar do usuário ou do membro citado.',
            usage: 'avatar `[@membro]`',
            aliases: ['av'],
            category: 'Utilidades',
            botPerms: ['EMBED_LINKS']
        });
    }

    run(_, msg) {

        const embed = new Internals.BaseEmbed();
        const user = msg.mentions.users.first() || msg.author;
        const url = user.avatarURL({ dynamic: true, size: 2048 });

        if (url) {
            
            embed
                .setTitle(`Avatar de ${user.tag}`)
                .setDescription(`[Redirecionar-se ao link original da imagem](${url})`)
                .setFooter(msg.author.username, msg.author.displayAvatarURL())
                .setImage(user.displayAvatarURL({ 
                    dynamic: true, 
                    size: 2048 
                }));
        } else {
            embed.setDescription('🤷‍♀️ O usuário não possui um avatar.');
        }

        msg.channel.send(embed);
    }
}

module.exports = Avatar;