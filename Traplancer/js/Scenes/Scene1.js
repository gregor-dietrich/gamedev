class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("background", "assets/images/background.png");
        this.load.spritesheet("player", "assets/spritesheets/player.png",{
            frameWidth: 16,
            frameHeight: 24
        });
        this.load.spritesheet("ship1", "assets/spritesheets/ship1.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("ship2", "assets/spritesheets/ship2.png",{
            frameWidth: 32,
            frameHeight: 16
        });
        this.load.spritesheet("ship3", "assets/spritesheets/ship3.png",{
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("explosion", "assets/spritesheets/explosion.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("powerup", "assets/spritesheets/powerup.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("beam", "assets/spritesheets/beam.png",{
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");

        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship1"),
            frameRate: gameSettings.fps,
            repeat: -1
        });
        this.anims.create({
            key: "ship2_anim",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate: gameSettings.fps,
            repeat: -1
        });
        this.anims.create({
            key: "ship3_anim",
            frames: this.anims.generateFrameNumbers("ship3"),
            frameRate: gameSettings.fps,
            repeat: -1
        });
        this.anims.create({
            key: "explosion",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: gameSettings.fps,
            repeat: 0,
            hideOnComplete: true
        });
        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNumbers("powerup", {
                start: 0,
                end: 1
            }),
            frameRate: gameSettings.fps / 4,
            repeat: -1
        });
        this.anims.create({
            key: "gray",
            frames: this.anims.generateFrameNumbers("powerup", {
                start: 2,
                end: 3
            }),
            frameRate: gameSettings.fps / 2,
            repeat: -1
        });
        this.anims.create({
            key: "thrust",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: gameSettings.fps,
            repeat: -1
        });
        this.anims.create({
            key: "beam_anim",
            frames: this.anims.generateFrameNumbers("beam"),
            frameRate: gameSettings.fps,
            repeat: -1
        });
    }
}