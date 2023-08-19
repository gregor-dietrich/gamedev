var gameSettings = {
    playerSpeed: 2,
    playerJumpHeight: 300,
    fps: 10
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
        var block = platform.create(i * blockWidth + startingX, scene.game.config.height - 15, "platform_grass" + Phaser.Math.Between(1, 3));
        block.setScale(2);
        if (physicsEnabled) {
            scene.physics.world.enable(block);
            block.body.immovable = true;
        }
    }
    if (physicsEnabled) {
        scene.physics.add.collider(scene.player, platform);
    }
    console.log("Created platform at " + startingX + " with length " + length);
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
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
            }
    };
    game = new Phaser.Game(config);
}