// TO DO: 
// Improve visual presentation of questions
// Display point gain/loss
// Add final score to gameWin()
// Add spike traps 50% chance of appearing if platform is longer than 30 blocks
// Add items, 50% chance of appearing for every 10 blocks of platform length
// Use questionSound as pauseSound
// Add sounds: cherry, gem, unpause(?), (new) question
// Add background music intro before the loop
// Add more props
// Improve decoration of platforms
// Add arrival at the school

var gameSettings = {
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
    enemySpawnFrequency: 1, // every Nth platform
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

setTileSpriteRepeating = function(tilesprite) {
    tilesprite.fixedToCamera = true;
    tilesprite.setOrigin(0, 0);
    tilesprite.setDepth(-100);
}

createBackgrounds = function(scene) {
    scene.background = scene.add.tileSprite(0, 0, config.width, config.height, 'background');
    scene.middleground = scene.add.tileSprite(0, 120, config.width, config.height, 'middleground');        
    setTileSpriteRepeating(scene.background);
    setTileSpriteRepeating(scene.middleground);
}

createPlatform = function(scene, length, startingX = 0, physicsEnabled = true) {
    var platform = physicsEnabled ? scene.physics.add.group() : scene.add.group();
    var blockWidth = 32;
    for (var i = 0; i < length; i++) {
        var block = platform.create(i * blockWidth + startingX, scene.game.config.height - 15, "grass" + Phaser.Math.Between(1, 3));
        block.setScale(2);
        if (Phaser.Math.Between(0, 1) == 1) {
            block.flipX = true;
        }
        if (physicsEnabled) {
            scene.physics.world.enable(block);
            block.body.immovable = true;
        }
    }
    if (physicsEnabled) {
        scene.physics.add.collider(scene.player, platform);
    }
    return platform;
}


createProp = function(scene, propName, positionX) {
    var positionY = config.height;
    var scale = 1.5;
    switch (propName) {
        case "bush":
            positionY -= 53;
            break;
        case "palm":
            positionY -= 164;
            break;
        case "pine":
            positionY -= 130;
            break;
        case "rock":
            positionY -= 51;
            scale = 2.5;
            break;
        case "shrooms":
            positionY -= 43;
            break;
        case "tree":
            positionY -= 102;
            break;
        case "tree2":
            positionY -= 115;
            break;
    }

    var prop = scene.physics.add.image(positionX, positionY, propName);
    prop.setScale(scale);
    scene.props.add(prop);
    return prop;
}

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