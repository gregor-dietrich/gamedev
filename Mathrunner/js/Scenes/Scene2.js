class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.middleground = this.add.tileSprite(0, 120, config.width, config.height, 'middleground');        
        this.setTileSpriteRepeating(this.background);
        this.setTileSpriteRepeating(this.middleground);
    }

    update() {
        this.background.tilePositionX += gameSettings.playerSpeed;
        this.middleground.tilePositionX += gameSettings.playerSpeed * 2;

        // this.player.body.velocity.y = -170;
    }

    setTileSpriteRepeating(tilesprite) {
        tilesprite.fixedToCamera = true;
        tilesprite.setOrigin(0, 0);
    }
}