
class Module {

    enabled = true;

    toggle() {
        return this.enabled = this.enabled ? false : true;
    }

    async run(...args) {
        if (this.function && this.enabled) 
        { 
            return this.function(...args); 
        } else { return; }
    }
}

module.exports = Module;