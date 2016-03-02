const Component = require('../common/Component');

function init() {
    const currentHash = window.location.hash || '#timer';
    this.menuItemElems = Array.prototype.slice.call(this.elem.querySelectorAll('.nav-item'));
    this.navElem = this.elem.querySelector('.nav');
    this.navToggleBtnElem = this.elem.querySelector('.nav-toggle-btn');
    this.navOverlayElem = this.elem.querySelector('.nav-overlay');
    this.currentSectionElem = this.elem.querySelector('.current-section');
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
        item.addEventListener('click', this.handleNavItemClick.bind(this));
    });

    this.navOverlayElem.addEventListener('click', this.toggleNav.bind(this));
    this.navToggleBtnElem.addEventListener('click', this.toggleNav.bind(this, true));
}

function handleNavItemClick(e){
    this.selectedTab = e.target.href.split('#')[1];
    this.pubsub.publish('menuClick', this.selectedTab);

    this.updateClasses(e.currentTarget);
    this.toggleNav();
}

function toggleNav(e, open) {
    if (open) {
        this.navElem.classList.add('open');
    } else {
        this.navElem.classList.toggle('open');
    }
}

function updateClasses(activeElem) {
    this.menuItemElems.forEach( item => {
        item.classList.remove('active');
    });

    this.currentSectionElem.innerHTML = activeElem.innerHTML;
    activeElem.classList.add('active');
}

const menu = Object.create(Component, {
    name: { value: 'menu' },
    elem: { value: document.querySelector('header')},
    navElem: { writable: true, value: null },
    navToggleBtnElem: { writable: true, value: null },
    navOverlayElem: { writable: true, value: null },
    currentSectionElem: { writable: true, value: null },
    init: { value: init },
    addListener: { value: addListener },
    toggleNav: { value: toggleNav },
    handleNavItemClick: { value: handleNavItemClick },
    selectedTab: { writable: true, value: null },
    updateClasses: { value: updateClasses },
    menuItemElems: { writable: true, value: [] }
});

menu.registerComponent();

module.exports = menu;