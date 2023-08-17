class Scene2 extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.middleground = this.add.tileSprite(0, 120, config.width, config.height, 'middleground');        
        this.setTileSpriteRepeating(this.background);
        this.setTileSpriteRepeating(this.middleground);

        this.title = this.add.bitmapText(config.width / 2 - 120, 50, "pixelFont", "MATH RUNNER", 48);
        this.title.tint = 0x000000;
        this.start = this.add.bitmapText(config.width / 2 - 80, 90, "pixelFont", "Click/Tap to Start", 24);
        this.start.tint = 0x000000;

        this.tweens.add({
            targets: this.start,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        this.input.on('pointerdown', function(pointer) {
            this.scene.start("playGame");
        }, this);
    }

    setTileSpriteRepeating(tilesprite) {
        tilesprite.fixedToCamera = true;
        tilesprite.setOrigin(0, 0);
    }
}