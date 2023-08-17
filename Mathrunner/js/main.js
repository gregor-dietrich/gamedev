var gameSettings = {
    playerSpeed: 2,
    fps: 20
}

var musicConfig = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
}

var config;
window.onload = function() {
    config = {
        width: 700,
        height: 300,
        backgroundColor: 0x333333,
        pixelArt: true,
        type: Phaser.AUTO,
        scene: [Scene1, Scene2],
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        }
    };
    var game = new Phaser.Game(config);
}