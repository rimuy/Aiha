
class Event {
    constructor(options) {

        this.name = options.event;
        this.run = options.callback;

    }
}

module.exports = Event;