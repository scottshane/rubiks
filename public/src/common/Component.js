const pubsub = require('../common/pubsub');
const app = require('../common/app');

const Component = {
    name: '',
    elem: null,
    pubsub,
    init(){},
    registerComponent() {
        app.componentList.push(this);
    }
};

module.exports = Component;