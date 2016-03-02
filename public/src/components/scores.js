const Component = require('../common/Component');

// Private prototype methods
function init() {
    this.pubsub.subscribe('getScores', this.handleGetScores.bind(this));
    this.addListeners();
}

function render() {
    const scoreContainerElem = this.elem.querySelector('ul');
    const scoreTemplate = this.elem.querySelector('.score');
    const frag = document.createDocumentFragment();
    frag.appendChild(scoreTemplate);
    this.filteredScoreData.forEach( score => {
        const scoreElem = scoreTemplate.cloneNode(true);
        const username = scoreElem.querySelector('.username');
        const cubetype = scoreElem.querySelector('.cubetype');
        const time = scoreElem.querySelector('.time');

        username.removeAttribute('data-filter');
        cubetype.removeAttribute('data-filter');
        time.removeAttribute('data-filter');

        username.innerHTML = score.name;
        cubetype.innerHTML = score.type;
        time.innerHTML = score.time;

        //TODO document fragment
        frag.appendChild(scoreElem);
    });
    scoreContainerElem.innerHTML = '';
    scoreContainerElem.appendChild(frag);
}

function handleGetScores(data) {
    this.scoreData = data;
    this.filterScoreData();
    this.render();
    this.renderFilters();
}

function handleSortDirection(sortData) {
    if (this.currentSort === sortData && this.currentSortDirection === 'asc') {
        this.currentSortDirection = 'desc'
    } else {
        this.currentSortDirection = 'asc'
    }
}

function sortScores(sortData) {
    let filteredData = [...this.filteredScoreData]; // convert to array for sort()
    this.handleSortDirection(sortData);
    this.currentSort = sortData;

    filteredData.sort( (a, b) => {
        const val1 = (typeof a[this.currentSort] === 'string') ? a[this.currentSort].toLowerCase() : a[this.currentSort];
        const val2 = (typeof b[this.currentSort] === 'string') ? b[this.currentSort].toLowerCase() : b[this.currentSort];

        if (this.currentSortDirection === 'asc') {
            return val1 > val2;
        } else {
            return val1 < val2;
        }
    }, this);

    // convert back set
    this.filteredScoreData = new Set(filteredData);

    this.render();
}

function addListeners() {
    const sortElems = Array.prototype.slice.call(this.elem.querySelectorAll('[data-sort]'));
    const filterBtn = this.elem.querySelector('.filter-scores-btn');
    sortElems.forEach(elem => {
        const sortData = elem.getAttribute('data-sort');
        elem.addEventListener('click', this.sortScores.bind(this, sortData));
    }, this);

    filterBtn.addEventListener('click', this.toggleFilters.bind(this));

    this.filterScoresElem.addEventListener('change', handleFilterChange.bind(this));
}

function renderFilters() {
    const filtersTemplate = this.elem.querySelector('.scores .filter');
    const frag = document.createDocumentFragment();
    const filterCats = Object.keys(this.scoreData.filters);
    let inputTemplate = filtersTemplate.querySelector('input');
    let labelTemplate = filtersTemplate.querySelector('label');
    let fieldsetTemplate = filtersTemplate.querySelector('fieldset');

    // remove the dummy template node
    filtersTemplate.removeChild(fieldsetTemplate);

    filterCats.forEach( fc => {
        if (fc === 'id' || fc === 'time') { return; }
        const items = this.scoreData.filters[fc];
        let tmpl = filtersTemplate.cloneNode(true); 

        tmpl.querySelector('h3').innerHTML = fc;

        Object.keys(items).forEach(i => {
            let fieldsetTmpl = fieldsetTemplate.cloneNode(); 
            let inputTmpl = inputTemplate.cloneNode();
            let labelTmpl = labelTemplate.cloneNode();
            inputTmpl.setAttribute('name', i.trim());
            inputTmpl.setAttribute('data-filter-type', fc.trim());
            labelTmpl.setAttribute('for', i);
            labelTmpl.innerHTML = i.trim();
            fieldsetTmpl.appendChild(labelTmpl);
            fieldsetTmpl.appendChild(inputTmpl);
            tmpl.appendChild(fieldsetTmpl);
        });

        frag.appendChild(tmpl);
    });

    this.filterScoresElem.innerHTML = '';
    this.filterScoresElem.appendChild(frag);
}

function toggleFilters(e) {
    // reset filters
    this.elem.classList.toggle('show-filters');
}

function handleFilterChange(e) {
    const newFilter = e.target.getAttribute('name');
    const filterType = e.target.getAttribute('data-filter-type');
    const isChecked = e.target.checked;

    if (isChecked) {
        // TODO use set
        if (this.filterOrder.indexOf(filterType) === -1) {
            this.filterOrder.push(filterType);
        }
        if (!this.currentFilters[filterType]) {
            this.currentFilters[filterType] = [];
        }
        this.currentFilters[filterType].push(newFilter);
    } else {
        const filterIdx = this.currentFilters[filterType].indexOf(newFilter);
        this.currentFilters[filterType].splice(filterIdx, 1);
        if (!this.currentFilters[filterType].length) {
            this.filterOrder.splice(this.filterOrder.indexOf(filterType), 1);
        }
    }

    this.filterScoreData();
    this.render();
}

function filterScoreData() {
    // no filters applied
    if (!this.filterOrder.length) { 
        this.filteredScoreData = this.scoreData.scores;
        return;
    }

    this.filteredScoreData = [];
    const filtered = new Set();

    this.scoreData.scores.filter(data => {
        const f = this.filterOrder[0];
        const filters = this.currentFilters[f];
        if (filters.indexOf(data[f]) > -1) {
            filtered.add(data);
        }
    });

    this.filterOrder.forEach( (f, idx) => { // name
        if (idx === 0) { return; }
        let filters = this.currentFilters[f]; // Ruby
        filtered.forEach(data => {
            if (filters.indexOf(data[f]) === -1) {
                filtered.delete(data);
            }
        });
    });
    this.filteredScoreData = filtered;
}

// Inherit from Component
// Set instance props and methods
const scores = Object.create(Component, {
    name: { value: 'scores' },
    elem: { value: document.querySelector('.scores') },
    init: { value: init },
    addListeners: { value: addListeners },
    render: { value: render },
    currentFilters: { value: {}, writable: true },
    filterOrder: { value: [], writable: true },
    filterScoresElem: { value: document.querySelector('.filter-scores') },
    sortScores: { value: sortScores },
    handleGetScores: { value: handleGetScores },
    handleSortDirection: { value: handleSortDirection },
    scoreData: { writable: true, value: {}},
    filteredScoreData: { writable: true, value: [] },
    currentSort: { writable: true, value: null },
    currentSortDirection: { writable: true, value: 'asc' },
    renderFilters: { value: renderFilters },
    toggleFilters: { value: toggleFilters },
    filterScoreData: { value: filterScoreData }
});

// Register self
scores.registerComponent();

module.exports = scores;