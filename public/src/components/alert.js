const Component = require('../common/Component');

function init() {
    this.addListener();
}

function addListener() {
    const closeBtn = this.elem.querySelector('.alert-close');
    window.clearTimeout(this.timer);
    closeBtn.addEventListener('click', this.toggleAlert.bind(this));
}

function render(type, msg) {
    const msgElem = this.elem.querySelector('.alert-msg');
    msgElem.innerHTML = msg;
    this.elem.classList.add(type);
    this.toggleAlert();
}

function setTimer() {
    this.timer = window.setTimeout(this.toggleAlert.bind(this), 2000);
}

function toggleAlert() {
    if (this.visible) {
        this.elem.classList.add('hidden');
        this.visible = false;
    } else {
        this.elem.classList.remove('hidden');
        this.setTimer();
        this.visible = true;
    }
}

const alert = Object.create(Component, {
    name: { value: 'alert' },
    elem: { value: document.querySelector('.alert') },
    init: { value: init },
    render: { value: render },
    addListener: { value: addListener },
    setTimer: { value: setTimer },
    toggleAlert: { value: toggleAlert },
    visible: { writable: true, value: true }
});

alert.registerComponent();

module.exports = alert;