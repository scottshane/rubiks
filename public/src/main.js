const api = require('./common/api');
const app = require('./common/app');

const alert = require('./components/alert');
const cubes = require('./components/cubes');
const cubesMenu = require('./components/cubesMenu');
const menu = require('./components/menu');
const scores = require('./components/scores');
const timer = require('./components/timer');
const router = require('./common/router');

console.log('%capp %o', 'color:teal', app);

// get data
api.getCubes();
api.getScores();

// init components
app.initComponents();