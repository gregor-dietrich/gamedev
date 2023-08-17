class Scene3 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.middleground = this.add.tileSprite(0, 120, config.width, config.height, 'middleground');        
        this.setTileSpriteRepeating(this.background);
        this.setTileSpriteRepeating(this.middleground);

        this.setPaused(true);
        this.createPlayer();

        this.platforms = this.physics.add.group();
        this.physics.add.collider(this.player, this.platforms);
    }

    update() {
        if (this.paused) {
            return;
        }

        this.background.tilePositionX += gameSettings.playerSpeed;
        this.middleground.tilePositionX += gameSettings.playerSpeed * 2;

        // this.player.body.velocity.y = -170;
    }

    setPaused(paused) {
        this.paused = paused;
    }

    pauseGame() {
        this.setPaused(true);
        this.player.play("player-idle_anim");
    }

    unPauseGame() {
        this.setPaused(false);
        this.player.play("player-run_anim");
    }

    createPlayer() {
        this.player = this.physics.add.sprite(-33, config.height - 64, "player-run");
        this.player.setScale(2);
        this.player.play("player-run_anim");

        // Enable physics on the player
        this.physics.world.enable(this.player);
        //this.player.body.gravity.y = 500;

        // Player intro animation
        this.tweens.add({
            targets: this.player,
            x: 200,
            duration: 1000,
            ease: 'Power1',
            repeat: 0
        });

        // Starting monologue
        this.time.delayedCall(1000, function() {
            this.player.play("player-idle_anim");
            this.playerSpeak("Oh no! I'm late for school!\nI need to get there fast!");

            this.time.delayedCall(6000, function() {
                this.playerSpeak("I hope I don't run into too many\nanimals with math questions again!", 6000);
                this.unPauseGame();
            }, [], this);
        }, [], this);
    }

    playerSpeak(text, duration = 5000, fadeInSpeed = 1000, fadeOutSpeed = 500) {
        this.playerText = this.add.bitmapText(this.player.x + 25, this.player.y - 15, "pixelFont", text, 24);
        this.playerText.alpha = 0;
        
        this.tweens.add({
            targets: this.playerText,
            alpha: 1,
            duration: fadeInSpeed,
            ease: 'Bounce',
            repeat: 0
        });

        this.time.delayedCall(duration, function() {
            this.tweens.add({
                targets: this.playerText,
                alpha: 0,
                duration: fadeOutSpeed,
                ease: 'Power4',
                repeat: 0
            });
        }, [], this);
    }

    setTileSpriteRepeating(tilesprite) {
        tilesprite.fixedToCamera = true;
        tilesprite.setOrigin(0, 0);
    }
}