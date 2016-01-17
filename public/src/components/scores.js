const Component = require('../common/Component');

// Private prototype methods
function init() {
    this.pubsub.subscribe('getScores', this.handleGetScores.bind(this));
}

function render() {
    const scoreTemplate = this.elem.querySelector('.score');
    this.scoreData.map( score => {
        const scoreDiv = scoreTemplate.cloneNode(true);
        const username = scoreDiv.querySelector('.username');
        const cubetype = scoreDiv.querySelector('.cubetype');
        const time = scoreDiv.querySelector('.time');

        username.innerHTML = score.name;
        cubetype.innerHTML = score.type;
        time.innerHTML = score.time;

        this.elem.appendChild(scoreDiv);
    });
}

function handleGetScores(data) {
    this.scoreData = data;
    this.render();
}

// Inherit from Component
// Set instance props and methods
const scores = Object.create(Component, {
    name: { value: 'scores' },
    elem: { value: document.querySelector('.scores') },
    init: { value: init },
    render: { value: render },
    handleGetScores: { value: handleGetScores },
    scoreData: { writable: true, value: {}}
});

// Register self
scores.registerComponent();

module.exports = scores;