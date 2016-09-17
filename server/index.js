const http = require('http');
const querystring = require('querystring');
const path = require('path');

const config = require('./config.json');
const PORT = config.port;
const MAPPINGS = config.mappings;
const PLAYER = config.player;
const LocalMediaPlayer = require('./media-player/local-media-player');
const localMediaPlayer = new LocalMediaPlayer(PLAYER);

function play(wd, file) {
    const matches = MAPPINGS.filter(m => {
        const source = m.source;
        return new RegExp(source).test(wd);
    });

    if (matches.length === 1) {
        const {destination} = matches[0];
        const filePath = path.resolve(destination, file);
        localMediaPlayer.play(filePath);
    } else {
        // todo
    }
}

function stop() {
    localMediaPlayer.stop();
}

http.createServer((req, res) => {
    const {url} = req;
    if (url.match('/stop')) {
        stop();
    } else if (url.match('/play')) {
        const query = url.replace(/.*\?/, '');
        const {wd, file} = querystring.parse(query);
        if (wd && file) {
            play(wd, file);
        } else {
            console.log(`Both wd and file are required in query to play. Wd: ${wd}, file: ${file}`);
        }
    } else {
        console.log('Unknown request');
    }
    res.end();
}).listen(PORT);
