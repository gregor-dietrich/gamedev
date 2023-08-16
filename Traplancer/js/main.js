var gameSettings = {
    playerSpeed: 200,
    fps: 20
}

var config;
window.onload = function() {
    config = {
        width: 256,
        height: 272,
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