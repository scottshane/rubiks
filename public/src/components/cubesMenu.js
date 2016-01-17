const Component = require('../common/Component');

function init() {
    this.pubsub.subscribe('getCubes', this.handleGetCubes.bind(this));
}

function render() {
    Object.keys(this.cubeData).map( key => {
        const cube = this.cubeData[key];
        const option = document.createElement('option');
        option.value = cube.type;
        option.innerHTML = cube.name;
        this.elem.appendChild(option);
    });
    this.addListener();
}

function handleGetCubes(data) {
    this.cubeData = data;
    this.render();
}

function addListener() {
    const cubesMenuElem = document.querySelector('.cubes-menu');
    cubesMenuElem.addEventListener('change', function(e) {
        const options = e.currentTarget.options;
        const selectedIndex = options.selectedIndex;
        const value = options[selectedIndex].value;
        this.selectedCube = this.cubeData[value];
        this.pubsub.publish('selectedCube', this.selectedCube);
    }.bind(this))
}

const cubesMenu = Object.create(Component, {
    name: { value: 'cubesmenu' },
    elem: { value: document.querySelector('.cubes-menu') },
    init: { value: init },
    render: { value: render },
    addListener: { value: addListener },
    cubeData: { writable: true, value: {} },
    handleGetCubes: { value: handleGetCubes },
    selectedCube: { writable: true, value: null }
});

cubesMenu.registerComponent();

module.exports = cubesMenu;