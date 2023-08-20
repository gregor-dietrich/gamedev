class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        // Font
        this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

        // Environment
        this.load.image("background", "assets/images/environment/back.png");
        this.load.image("bush", "assets/images/environment/bush.png");
        this.load.image("middleground", "assets/images/environment/middle.png");
        this.load.image("palm", "assets/images/environment/palm.png");
        this.load.image("pine", "assets/images/environment/pine.png");
        this.load.image("rock", "assets/images/environment/rock.png");
        this.load.image("shrooms", "assets/images/environment/shrooms.png");
        this.load.image("tree", "assets/images/environment/tree.png");
        this.load.image("tree2", "assets/images/environment/tree2.png");

        // Platforms
        this.load.image("platform_grass1", "assets/images/platforms/grass1.png");
        this.load.image("platform_grass2", "assets/images/platforms/grass2.png");
        this.load.image("platform_grass3", "assets/images/platforms/grass3.png");

        // Player
        this.loadSpritesheets("player", ["idle", "run", "jump", "hurt"], 33, 32);

        // Enemies
        this.loadSpritesheets("enemy", ["eagle"], 40, 41);
        this.loadSpritesheets("enemy", ["frog-idle", "frog-jump"], 35, 32);
        this.loadSpritesheet("enemy", "possum", 36, 28);

        // Items
        this.loadSpritesheet("item", "cherry", 21, 21);
        this.loadSpritesheet("item", "gem", 15, 13);
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("titleScreen");
        // this.scene.start("playGame");

        // Animations
        this.createAnimations("item", ["cherry", "gem"], gameSettings.fps, -1);
        this.createAnimations("player", ["idle", "run"], gameSettings.fps, -1);
        this.createAnimations("player", ["hurt", "jump"], gameSettings.fps / 4, 0);
        this.createAnimations("enemy", ["eagle", "frog-idle", "frog-jump", "possum"], gameSettings.fps / 2, -1);
    }

    loadSpritesheets(prefix, names, width, height) {
        for (var i = 0; i < names.length; i++) {
            this.loadSpritesheet(prefix, names[i], width, height);
        }
    }

    loadSpritesheet(prefix, name, width, height) {
        this.load.spritesheet(prefix + "-" + name, "assets/spritesheets/" + prefix + "/" + prefix + "-" + name + ".png",{
            frameWidth: width,
            frameHeight: height
        });
    }

    createAnimations(prefix, names, frameRate, repeat, shouldHideOnComplete) {
        for (var i = 0; i < names.length; i++) {
            this.createAnimation(prefix, names[i], frameRate, repeat);
        }
    }

    createAnimation(prefix, name, fps, repeat, shouldHideOnComplete = false) {
        this.anims.create({
            key: prefix + "-" + name + "_anim",
            frames: this.anims.generateFrameNumbers(prefix + "-" + name),
            frameRate: fps,
            repeat: repeat,
            hideOnComplete: shouldHideOnComplete
        });
    }
}