const Component = require('../common/Component');
const api = require('../common/api');
const alert = require('./alert');

function init(){
    this.pubsub.subscribe('getCubes', this.handleGetCubes.bind(this));
    this.pubsub.subscribe('addCube', this.handleAddCube.bind(this));

    this.addListener();
}

function addListener() {
    const form = this.elem.querySelector('form');
    const cubes = Array.prototype.slice.call(this.elem.querySelectorAll('.cube'));

    cubes.map( cube => {
        cube.addEventListener('click', (e) => {
            if (e.target.classList.contains('save')) {
                const cubeElem = e.currentTarget;
                const name = cubeElem.querySelector('.cube-name').innerHTML;
                const type = cubeElem.querySelector('.cube-type').innerHTML;
                const inspectionTime = cubeElem.querySelector('.inspection-time').innerHTML;
                this.updateCube({name, type, inspectionTime});
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.currentTarget.querySelector('#cube-name').value;
        const inspectionTime = e.currentTarget.querySelector('#inspection-time').value;
        const type = name.replace(' ', '');
        this.updateCube({name, type, inspectionTime});
    });
}

function render() {
    const existingCubesElem = this.elem.querySelector('.existing-cubes');
    const cubeTemplate = existingCubesElem.querySelector('.cube');

    Object.keys(this.cubeData).map( key => {
        const cube = this.cubeData[key];
        const tmp = cubeTemplate.cloneNode(true);
        const cubeNameElem = tmp.querySelector('.cube-name');
        const cubeTypeElem = tmp.querySelector('.cube-type');
        const inspectionTimeElem = tmp.querySelector('.inspection-time');
        cubeNameElem.innerHTML = cube.name;
        cubeTypeElem.innerHTML = cube.type;
        inspectionTimeElem.innerHTML = cube.inspectionTime;
        tmp.setAttribute('contenteditable',true);
        existingCubesElem.appendChild(tmp);
    });
}

function handleAddCube(data) {
    if (data.status === 'error') {
        alert.render('error', data.msg);
    } else {
        alert.render('success', data.msg);
    }
}

function handleGetCubes(data) {
    this.cubeData = data;
    this.render();
    this.addListener();
}

function updateCube(data) {        
    const req = JSON.stringify({cube: {name: data.name, type: data.type, inspectionTime: data.inspectionTime}});
        api.addCube(req);
}

const cube = Object.create(Component, {
    name: { writable: false, value: 'cube' },
    elem: { writable: false, value: document.querySelector('.cubes') },
    init: { value: init },
    addListener: { value: addListener },
    render: { value: render },
    handleAddCube: { value: handleAddCube },
    handleGetCubes: { value: handleGetCubes },
    updateCube: { value: updateCube },
    cubeData: { writable: true, value: {} }
});

cube.registerComponent();

module.exports = cube;
