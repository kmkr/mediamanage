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
        console.log(`Unable to find match for wd ${wd} - file ${file} cannot be played`);
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
            const message = `Both wd and file are required in query to play. Wd: ${wd}, file: ${file}`;
            console.log(message);

            res.writeHead(400, message);
        }
    } else {
        res.writeHead(404);
    }
    res.end();
}).listen(PORT);
