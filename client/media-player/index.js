const path = require('path');
const http = require('http');
const querystring = require('querystring');

const config = require('../config.json');

const remote = config.mediaPlayer.remote;
const [hostname, port] = remote.split(':');

exports.play = filePath => {
    const wd = path.parse(filePath).dir;
    const fileName = path.parse(filePath).base;
    const url = `http://${hostname}:${port}/play?wd=${querystring.escape(wd)}&file=${querystring.escape(fileName)}`;
    http.get(url, res => {
        console.log(`Got response: ${res.statusCode}`);
        res.resume();
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
};

exports.stop = () => {
    const url = `http://${hostname}:${port}/stop`;
    http.get(url, res => {
        console.log(`Got response: ${res.statusCode}`);
        res.resume();
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
};
