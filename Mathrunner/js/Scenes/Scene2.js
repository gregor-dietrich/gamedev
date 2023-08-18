class Scene2 extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    create() {
        this.platforms = this.add.group();
        this.props = this.add.group();

        createBackgrounds(this);
        createPlatform(this, 22, false);

        this.createProps();
        this.createPlayer();
        this.createTexts();

        this.input.on('pointerdown', function(pointer) {
            this.scene.start("playGame");
        }, this);
    }

    createProps() {
        createProp(this, "palm", 0);
        createProp(this, "bush", 110);
        createProp(this, "bush", 190);
        createProp(this, "tree2", 150);
        createProp(this, "rock", 400);
        createProp(this, "shrooms", 370);
        createProp(this, "tree", 500);
        createProp(this, "pine", config.width);
    }

    createPlayer() {
        var player = this.add.sprite(config.width / 2 - 32, config.height - 64, "player-idle").setScale(2);
        player.setScale(2);
        player.play("player-idle_anim");
    }

    createTexts() {
        var title = this.add.bitmapText(config.width / 2 - 132, 50, "pixelFont", "MATH RUNNER", 48);
        title.tint = 0x000000;
        var start = this.add.bitmapText(config.width / 2 - 90, 90, "pixelFont", "Click/Tap to Start", 24);
        start.tint = 0x000000;

        this.tweens.add({
            targets: start,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });
    }
}