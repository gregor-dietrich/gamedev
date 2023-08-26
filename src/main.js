// TO DO: 
// Improve visual presentation of questions further
// Add spike traps 50% chance of appearing if platform is longer than 30 blocks
// Add items, 50% chance of appearing for every 10 blocks of platform length
// Use questionSound as pauseSound
// Add sounds: cherry, gem, unpause(?), (new) question
// Add background music intro before the loop
// Add more props
// Improve decoration of platforms
// Add arrival at the school

var gameSettings = {
    language: "en",
    // score calculation
    scorePerSecond: 300,
    cherryBonus: 500,
    gemBonus: 1000,
    questionBonus: 20000,
    questionPenalty: 15000,
    trapPenalty: 10000,
    // player settings
    playerSpeed: 1,
    playerJumpHeight: 300,
    playerGravity: 500,
    // level generation
    platformLengthMin: 20,
    platformLengthMax: 50,
    platformGapMin: 120,
    platformGapMax: 240,
    propDensity: 1,
    enemySpawnFrequency: 5, // every Nth platform
    enemySpawnChance: 100, // in percent
    // misc
    fps: 10 // spritesheet fps
}

var sfxConfig = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: false,
    delay: 0
}

var musicConfig = {
    mute: false,
    volume: 0.5,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
}

var config;
var game;

window.onload = function() {
    config = {
        width: 700,
        height: 300,
        backgroundColor: 0x333333,
        pixelArt: true,
        type: Phaser.AUTO,
        scene: [Scene1, Scene2, Scene3],
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        },
        audio: {
            disableWebAudio: true
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };
    game = new Phaser.Game(config);
}