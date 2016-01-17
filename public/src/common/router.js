const Component = require('../common/Component');

function init() {
    console.log('%cinit %o', 'color:aquamarine', this);
    // keep state on page load
    let initialTab = window.location.hash.replace('#', '');

    if (!initialTab.length) {
        initialTab = 'timer';
    }

    this.showTab(initialTab);

    // route 
    this.pubsub.subscribe('menuClick', (tab) => {
        this.hideAll();
        this.showTab(tab);
    });
}

const router = Object.create(Component, {
    name: { writable: false, value: 'router' },
    init: { value: init }
});

router.elems = {
    'timer': document.querySelector('.timer'),
    'scores': document.querySelector('.scores'),
    'cubes': document.querySelector('.cubes')
};


router.hideAll = function() {
    Object.keys(this.elems).map(key => {
        this.elems[key].classList.add('hidden');
    });
};

router.showTab = function(tab) {
    this.elems[tab].classList.remove('hidden');
};

router.registerComponent();

module.exports = router;