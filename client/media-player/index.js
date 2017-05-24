const config = require('../config.json');

const logger = require('../vorpals/logger');
const removeCurrentWd = require('../helpers/remove-current-wd');

function getMediaPlayer() {
    if (!config.mediaPlayer) {
        logger.log('Missing config.mediaPlayer. Unable to play media.');
        return {
            get() {
                logger.log('Missing config.mediaPlayer. Unable to play media.');
            },
            stop() {
                logger.log('Missing config.mediaPlayer. Unable to play media.');
            }
        };
    } else {
        if (config.mediaPlayer.remote) {
            const remoteMediaPlayer = require('./remote-media-player');
            logger.log(`Using ${config.mediaPlayer.remote} as remote media player`);
            return remoteMediaPlayer;
        }

        if (config.mediaPlayer.local) {
            const PLAYER = config.mediaPlayer.local;
            const LocalMediaPlayer = require('../../common/media-player/local-media-player');
            const localMediaPlayer = new LocalMediaPlayer(PLAYER);
            logger.log(`Using ${config.mediaPlayer.local} as local media player`);
            return localMediaPlayer;
        }
    }
}

const mediaPlayer = getMediaPlayer();

exports.play = filePath => {
    logger.log(`Playing ${removeCurrentWd(filePath)}`);
    mediaPlayer.play(filePath);
};

exports.stop = () => {
    mediaPlayer.stop();
};
