const Component = require('../common/Component');

function init() {
    const currentHash = window.location.hash || '#timer';
    this.menuItemElems = Array.prototype.slice.call(this.elem.querySelectorAll('.menu-item'));
    this.addListener();

    // Set initial active class on element based on window hash
    if (currentHash) {
        const currentSelectedElem = this.elem.querySelector(`[href="${currentHash}"]`);
        this.selectedTab = currentHash.split('#')[1];
        this.updateClasses(currentSelectedElem);
    }
}

function addListener() {
    this.menuItemElems.forEach( item => {
        item.addEventListener('click', this.handleClick.bind(this));
    });
}

function handleClick(e){
    this.selectedTab = e.target.href.split('#')[1];
    this.pubsub.publish('menuClick', this.selectedTab);

    this.updateClasses(e.currentTarget);
}

function updateClasses(activeElem) {
    this.menuItemElems.forEach( item => {
        item.classList.remove('active');
    });

    activeElem.classList.add('active');
}

const menu = Object.create(Component, {
    name: { value: 'menu' },
    elem: { value: document.querySelector('.menu')},
    init: { value: init },
    addListener: { value: addListener },
    handleClick: { value: handleClick },
    selectedTab: { writable: true, value: null },
    updateClasses: { value: updateClasses },
    menuItemElems: { writable: true, value: [] }
});

menu.registerComponent();

module.exports = menu;