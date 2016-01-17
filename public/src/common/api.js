const reqwest = require('reqwest');
const pubsub = require('./pubsub');

const api = {
    addCube(data) {
        reqwest({
            url: '/api/cubes',
            type: 'json',
            data,
            method: 'post',
            contentType: 'application/json',
            error: (err) => {
                pubsub.publish('addCube', resp);
            },
            success: (resp) => {
                pubsub.publish('addCube', resp);
            }
        });
    },
    getCubes() {
        reqwest({
            url: '/api/cubes',
            method: 'get',
            error: (err) => { console.error(`error fetching cubes: ${err}`)},
            success: (resp) => { 
                pubsub.publish('getCubes', resp);
            }
        });
    },
    getScores() {
        reqwest({
            url: '/api/scores',
            method: 'get',
            error: (err) => { console.error(`error fetching scores: ${err}`)},
            success: (resp) => { 
                pubsub.publish('getScores', resp);
            }
        });
    },
    saveScore(data) {
        reqwest({
            url: '/api/scores',
            type: 'json',
            data,
            method: 'post',
            contentType: 'application/json',
            error: (err) => { console.error(`error saving cube: ${err}`)},
            success: (resp) => {
                pubsub.publish('saveScore', resp);
                console.log('%cindex %o', 'color:magenta', resp);
            }
        });
    }
};

module.exports = api;
