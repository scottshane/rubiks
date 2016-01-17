var pubsub = {
    events: {},
    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    },
    publish(eventName, args) {
        var eventArgs = args || [];
        if (this.events[eventName]) {
            this.events[eventName].map( callback => {
                callback(eventArgs);
            });
        }
    }
}


module.exports = pubsub;