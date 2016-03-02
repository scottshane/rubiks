const Component = require('../common/Component');
const api = require('../common/api');

function init() {
    this.resetBtn = this.elem.querySelector('.reset');
    this.hourElem = this.elem.querySelector('.hour');
    this.minElem = this.elem.querySelector('.min');
    this.secElem = this.elem.querySelector('.sec');
    this.scoreElem = this.elem.querySelector('.score');
    this.usernameElem = this.elem.querySelector('.username');
    this.submitScoreBtn = this.elem.querySelector('.submit-score-btn');

    this.addListeners();
    this.pubsub.subscribe('selectedCube', this.handleCubeSelection.bind(this));
}

function addListeners() {
    const scoreForm = this.elem.querySelector('.score form');
    this.resetBtn.addEventListener('click', (e) => {
        this.resetTimer();
    });

    scoreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.score.name = this.usernameElem.value;
        this.score.type = this.selectedCube.type;
        api.saveScore(JSON.stringify({score: this.score}));
        e.currentTarget.blur();
    });

    this.usernameElem.addEventListener('keyup', handleFormKeypress.bind(this));
    
    document.addEventListener('keypress', (e) => {
        if (e.which !== 32) { return; }
        this.toggleTimer();
    });
}

function handleCubeSelection(data) {
    this.selectedCube = data;
    this.resetBtn.classList.remove('hidden');
}

function handleFormKeypress(e) {
    const val = e.currentTarget.value.trim();

    if (val.length) {
        this.submitScoreBtn.removeAttribute('disabled');
    } else {
        this.submitScoreBtn.setAttribute('disabled', true);
    }
}

function startTimer(endTime) {
    const interval = 1;
    const start = new Date().getTime();
    const that = this;

    let hour = 0;
    let min = 0;
    let minIncrement = 0; // increments by 60
    let sec = 0;
    let secIncrement = 0; // increments by 60
    let elapsed = 0;

    this.timerStarted = true;
    this.timer = window.setInterval(function(){
        const time = new Date().getTime() - start;
        elapsed = Math.floor(time / 100) / 10;

        if (endTime && time >= endTime) {
            that.stopTimer();
            that.inspectionTimer = false;
            that.renderTimer();
            that.startTimer();
            that.score.time = 0;
        }

        // cache the score
        that.score.time = time;

        // subtract increments of 60 so the time "rollsover" back to 0
        sec = Math.floor(elapsed) - secIncrement;
        min = Math.floor(Math.floor(elapsed) / 60) - minIncrement;
        
        // each time we hit 60, 120, 240 ... increase the increment by 60
        if (sec%60 === 0 && sec > 0) {
            secIncrement+=60
        }

        if (min%60 === 0 && min > 0) {
            minIncrement+=60
        }

        // update HTML
        that.minElem.innerHTML = (min < 10) ? `0${min}` : min;
        that.secElem.innerHTML = (sec < 10) ? `0${sec}` : sec;
    }, interval);
}

function stopTimer() {
    this.timerStarted = false;
    window.clearInterval(this.timer);
    if (!this.inspectionTimer) {
        this.renderScore();
    }
}

function toggleTimer() {
    if (this.timerStarted) {
        this.stopTimer();
    } else {
        this.startTimer(+this.selectedCube.inspectionTime * 1000); // convert to miliseconds
        this.inspectionTimer = true;
    }
}

function renderTimer() {
    const timerLabel = this.elem.querySelector('.timer-label');
    const clock = this.elem.querySelector('.clock');

    if (this.inspectionTimer) {
        timerLabel.innerHTML = "Inspection Time";
        clock.classList.remove('solving');
        this.minElem.innerHTML = '00';
        this.secElem.innerHTML = '00';
        this.hourElem.innerHTML = '00';
        this.scoreElem.classList.add('hidden');
    } else {
        timerLabel.innerHTML = "Solve Timer";
        clock.classList.add('solving');
    }
}

function renderScore() {
    const cubetype = this.scoreElem.querySelector('.cubetype');
    const time = this.scoreElem.querySelector('.time');

    cubetype.value = this.selectedCube.name;
    time.value = `${this.score.time / 1000} seconds`;
    this.scoreElem.classList.remove('hidden');
    this.usernameElem.focus();
}

function resetTimer() {
    this.stopTimer();
    this.inspectionTimer = true;
    this.renderTimer();
}

const timer = Object.create(Component, {
    name: { value: 'timer' },
    elem: { value: document.querySelector('.timer') },
    init: { value: init },
    addListeners: { value: addListeners },
    resetBtn: { writable: true, value: null },
    hourElem: { writable: true, value: null },
    minElem: { writable: true, value: null },
    secElem: { writable: true, value: null },
    scoreElem: { writable: true, value: null },
    usernameElem: { writable: true, value: null },
    submitScoreBtn: { writable: true, value: null },
    inspectionTime: { writable: true, value: 0 },
    inspectionTimer: { writable: true, value: false },
    score: { value: {} },
    selectedCube: { writable: true, value: null },
    iterator: { writable: true, value: 0 },
    timerMax: { value: 60000 },
    timer: { writable: true, value: null },
    timerStarted: { writable: true, value: false },
    handleCubeSelection: { value: handleCubeSelection },
    startTimer: { value: startTimer },
    stopTimer: { value: stopTimer },
    toggleTimer: { value: toggleTimer },
    renderTimer: { value: renderTimer },
    renderScore: { value: renderScore },
    resetTimer: { value: resetTimer }
});

timer.registerComponent();

module.exports = timer;