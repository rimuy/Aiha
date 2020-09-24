const Client = require('nekos.life');

class NekosLife {

    static client = new Client();

    static get(key) {
        const self = this;

        async function func() { 
            return await self.client.sfw[key]();
        }

        return func();
    }

    static owoify(text) {
        const self = this;

        async function transform() { 
            return await self.client.sfw.OwOify({ text });
        }

        return transform();
    }

    static get neko() {
        return this.get('neko');
    }

    static get nekogif() {
        return this.get('nekoGif');
    }

    static get fox() {
        return this.get('foxGirl');
    }

    static get hug() {
        return this.get('hug');
    }

    static get smug() {
        return this.get('smug');
    }

    static get baka() {
        return this.get('baka');
    }

    static get tickle() {
        return this.get('tickle');
    }

    static get slap() {
        return this.get('slap');
    }

    static get poke() {
        return this.get('poke');
    }

    static get pat() {
        return this.get('pat');
    }

    static get kiss() {
        return this.get('kiss');
    }

    static get feed() {
        return this.get('feed');
    }

    static get cuddle() {
        return this.get('cuddle');
    }

    static get waifu() {
        return this.get('waifu');
    }

    static get avatar() {
        return this.get('avatar');
    }

    static get wallpaper() {
        return this.get('wallpaper');
    }

}

module.exports = NekosLife;