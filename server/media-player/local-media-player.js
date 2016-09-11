const spawn = require('child_process').spawn;

class LocalMediaPlayer {
    constructor(player) {
        this.player = player;
    }
    play(filePath) {
        this.playingProcess = spawn(this.player, [filePath]);
    }
    stop() {
        this.playingProcess && this.playingProcess.kill();
    }
}

module.exports = LocalMediaPlayer;
