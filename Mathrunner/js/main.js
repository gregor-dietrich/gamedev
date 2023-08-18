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
}

createBackgrounds = function(scene) {
    scene.background = scene.add.tileSprite(0, 0, config.width, config.height, 'background');
    scene.middleground = scene.add.tileSprite(0, 120, config.width, config.height, 'middleground');        
    setTileSpriteRepeating(scene.background);
    setTileSpriteRepeating(scene.middleground);
}

createPlatform = function(scene, length, physicsEnabled = true) {
    for (var i = 0; i < length; i++) {
        var platform = scene.platforms.create(i * 32 -2, config.height - 32, "platform_grass" + Phaser.Math.Between(1, 3));
        platform.setScale(2);
        platform.setOrigin(0, 0);
        // check if scene.platforms is a physics group
        if (physicsEnabled) {
            platform.body.allowGravity = false;
            platform.body.immovable = true;
        }
        // 50% chance to horizontally mirror the image
        if (Math.random() >= 0.5) {
            platform.flipX = true;
        }
    }
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

    var prop = scene.add.image(positionX, positionY, propName);
    prop.setScale(scale);
    scene.props.add(prop);
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