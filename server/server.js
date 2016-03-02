var express = require('express');
var fs = require('fs');
var path = require('path');
var uniqId = require('uniq-id');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

// routes
app.get('/', function(req, res) {
    //console.log(path.join(__dirname, '../public/index.html'))
    res.sendfile(path.join(__dirname, '../public/index.html'));
});

// api
app.get('/api/cubes', getCubes);

app.post('/api/cubes', saveCube);

app.get('/api/scores', getScores);

app.post('/api/scores', saveScore);

app.get('/api/scorefilters', getScoreFilters);

// api methods
function getCubes(req, res) {
    var cubeData;
    var resp = {};
    fs.readFile(path.join(__dirname, './cubes.txt'), 'utf-8', function(err, data) {
        if (err) {throw err}
        cubeData = data.toString().split('\n');
        cubeData.map(function(cd) {
            var obj = {};
            var arr = cd.split(',');

            obj.type = arr[0];
            obj.name = arr[1];
            obj.inspectionTime = arr[2];
            resp[arr[0]] = obj;
        });
        var sorted = Object.keys(resp).sort(function(a, b) {
            return a.inspectionTime - b.inspectionTime;
        });
        res.send(resp);
    });
}

function getScores(req, res) {
    var scoreData;
    var resp = [];
    fs.readFile(path.join(__dirname, './scores.txt'), 'utf-8', function(err, data) {
        if (err) {throw err}
        scoreData = data.toString().split('\n');
        scoreData.map(function(cd) {
            var obj = {};
            var arr = cd.split(',');

            obj.name = arr[0];
            obj.type = arr[1];
            obj.time = parseInt(arr[2], 10);
            obj.id = arr[3];
            resp.push(obj);
        });
        var scores = resp.reverse();
        var filters = getScoreFilters(scores);
        res.send({scores: scores, filters: filters});
    });
}

function getScoreFilters(scores) {
    if (!scores || !scores.length) { return; }

    var filterCats = Object.keys(scores[0]);
    var filtersMap = {};

    scores.forEach(function(sd) {
        var keys = Object.keys(sd);
        keys.forEach(function(k) {
            if (!filtersMap[k]) {
                filtersMap[k] = {};
            }
            filtersMap[k][sd[k]] = sd[k];
        }, this);
    }, this);

    scoreFiltersMap = filtersMap;
    return scoreFiltersMap;
}

function saveCube(req, res) {
    var newCubeData;
    var resp = {};
    var name;
    var type;
    var inspectionTime;
    var id = uniqId();

    if (req.body.cube.name && req.body.cube.type && req.body.cube.inspectionTime) {
        name = req.body.cube.name;
        type = req.body.cube.type;
        inspectionTime = req.body.cube.inspectionTime;
        newCubeData = '\n' + name + ',' + type + ',' + inspectionTime + ',' + id; 

        fs.readFile(path.join(__dirname, './cubes.txt'), 'utf-8', function(err, data) {
        if (err) {throw err}
            cubeData = data.toString().split('\n');
            cubeData.some(function(cd) {
                var obj = {};
                var arr = cd.split(',');

                obj.type = arr[0];
                obj.name = arr[1];
                obj.inspectionTime = arr[2];
                
                if (obj.type === type &&
                    obj.name === name &&
                    obj.inspectionTime === inspectionTime) {
                    resp.msg = 'Cube already exists';
                    resp.status = 'error';
                    res.status(200).send(resp);
                    return true;
                }
            });

            if (resp.status !== 'error') {
                fs.appendFile(path.join(__dirname, 'cubes.txt'), newCubeData, function(err) {
                if (err) { throw err; }
                    resp.msg = 'Cube saved';
                    resp.status = 'success';
                    res.status(200).send(resp);
                });
            }
        });
    }
}

function saveScore(req, res) {
    var data;
    var resp;
    var time;
    var type;
    var username;
    var id = uniqId();

    if (req.body.score && req.body.score.name && req.body.score.type && req.body.score.time) {
        username = req.body.score.name;
        type = req.body.score.type;
        time = req.body.score.time;
        data = '\n' + username + ',' + type + ',' + time + ',' + id; 

        fs.appendFile(path.join(__dirname, 'scores.txt'), data, function(err) {
            if (err) { throw err; }
            resp = 'ok'
        });
    }

    res.send(resp);
}


// start server
app.listen(8080);

module.exports = app;