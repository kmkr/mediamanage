const http = require('http');
const querystring = require('querystring');
const path = require('path');

const config = require('./config.json');
const PORT = config.port;
const MAPPINGS = config.mappings;
const PLAYER = config.player;
const LocalMediaPlayer = require('../common/media-player/local-media-player');
const localMediaPlayer = new LocalMediaPlayer(PLAYER);

function getFilePath(wd, file) {
    const matches = MAPPINGS.filter(mapping => {
        const source = mapping.source;
        return new RegExp(source).test(wd);
    });

    if (matches.length === 1) {
        const { source, destination } = matches[0];
        const filePath = path.resolve(wd.replace(new RegExp(source), destination), file);
        return filePath;
    }
}

http.createServer((req, res) => {
    const { url } = req;
    if (url.match('/stop')) {
        localMediaPlayer.stop();
    } else if (url.match('/play')) {
        const query = url.replace(/.*\?/, '');
        const { wd, file } = querystring.parse(query);

        if (!wd || !file) {
            const message = `Both wd and file are required in query to play. Wd: ${wd}, file: ${file}`;
            console.log(message);

            res.writeHead(400, message);
            res.end();
            return;
        }

        const filePath = getFilePath(wd, file);

        if (!filePath) {
            const message = `Unable to find match for wd ${wd} - file ${file} cannot be played`;
            console.log(message);

            res.writeHead(400, message);
            res.end();
            return;
        }

        localMediaPlayer.play(filePath);

    } else {
        res.writeHead(404);
    }
    res.end();
}).listen(PORT);
