/**
 *      Kevinwkz - 2020/10/05
 */

const { Internals, Server, Modules } = require('../..');

class ModulesCommand extends Internals.Command {
    constructor() {
        super('modules', {
            description: 'Gerenciador dos módulos do bot.',
            usage: 'modules `[módulo]`',
            category: 'Admin',
            botPerms: ['EMBED_LINKS'],
            userPerms: ['ADMINISTRATOR'],
        });
    }

    async run(msg, args) {

        const instance = msg.instance;
        const modules = {};
        
        Object.keys(Modules)
            .filter(key => Modules[key].run && Modules[key].toggle)
            .forEach(key => modules[key.toLowerCase()] = Modules[key]);

        const embed = new Internals.BaseEmbed();
        const module = modules[(args[0] || '').toLowerCase()];

        const icons = {
            on: `${instance.emojis.get('on1')}${instance.emojis.get('on2')}`,
            off: `${instance.emojis.get('off1')}${instance.emojis.get('off2')}`,
        };
        
        if (module) {
            embed.
                setDescription(`${instance.emojis.get('bot2Success')} **O módulo foi** \`${module.toggle() ? 'ativado' : 'desativado'}\` **com sucesso.**`);
        } else {

            const prefix = (await Server.Database.request('GET', 'settings')).prefix || '';

            embed
                .setTitle('Gerenciador de Módulos')
                .setDescription(
                    `Use **${prefix}**modules \`<módulo>\` para ativa-lo/desativa-lo.\n\n` +
                    Object.keys(Modules)
                        .filter(key => Modules[key].run && Modules[key].toggle)
                        .map(key =>
                            `${icons[Modules[key].enabled ? 'on' : 'off']} **${key}**`
                        ).join('\n')
                );
        }

        msg.target.send(embed);

    }
}

module.exports = ModulesCommand;