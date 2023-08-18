class Scene3 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.paused = true;

        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.middleground = this.add.tileSprite(0, 120, config.width, config.height, 'middleground');
        this.background.fixedToCamera = true;
        this.middleground.fixedToCamera = true;
        this.background.setOrigin(0, 0);
        this.middleground.setOrigin(0, 0);

        this.props = this.physics.add.group();
        this.platforms = this.physics.add.group();

        createPlatform(this, 70);
        createProp(this, "bush", 100);
        createProp(this, "palm", 300);
        createProp(this, "pine", 500);
        createProp(this, "rock", 700);
        createProp(this, "shrooms", 900);
        createProp(this, "tree", 1100);
        createProp(this, "tree2", 1300);

        this.createPlayer();

        this.physics.add.collider(this.player, this.platforms);
    }

    update() {
        if (this.paused) {
            return;
        }

        // game over
        if (this.player.y > config.height - 24) {
            // delay to allow player to fall off screen
            this.time.delayedCall(200, this.gameOver, [], this);
        }

        // move the background
        this.background.tilePositionX += gameSettings.playerSpeed;
        this.middleground.tilePositionX += gameSettings.playerSpeed * 2;
        this.background.tilePositionY = Math.sin(this.background.tilePositionX / 100);

        // jump if spacebar is pressed
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
            if (this.player.body.touching.down) {
                this.player.setVelocityY(-gameSettings.playerJumpHeight);
            }
        }
    }

    gameOver() {
        this.pauseGame();
        this.player.body.enable = false;

        this.time.delayedCall(2000, function() {
            this.title = this.add.bitmapText(config.width / 2 - 84, 50, "pixelFont", "GAME OVER", 48);
            this.title.tint = 0x000000;

            this.time.delayedCall(3000, function() {
                this.restart = this.add.bitmapText(config.width / 2 - 80, 90, "pixelFont", "Click/Tap to Restart", 24);
                this.restart.tint = 0x000000;
    
                this.tweens.add({
                    targets: this.restart,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Power2',
                    yoyo: true,
                    repeat: -1
                });

                this.player.destroy();
    
                this.input.on('pointerdown', function(pointer) {
                    this.scene.start("playGame");
                }, this);
            }, [], this);
        }, [], this);        
    }

    pauseGame() {
        this.paused = true;
        this.player.play("player-idle_anim");
        this.platforms.setVelocityX(0);
        this.props.setVelocityX(0);
    }

    unPauseGame() {
        this.paused = false;
        this.player.play("player-run_anim");
        this.platforms.setVelocityX(-gameSettings.playerSpeed * 100);
        this.props.setVelocityX(-gameSettings.playerSpeed * 100);
    }

    createPlayer() {
        // Add the player sprite
        this.player = this.physics.add.sprite(-33, config.height - 64, "player-run");
        this.player.setScale(2);
        this.player.play("player-run_anim");

        // Enable physics on the player
        this.physics.world.enable(this.player);
        this.player.body.gravity.y = 500;

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
                this.playerSpeak("I hope I won't run into too many\nanimals with math questions again!", 6000);
                this.unPauseGame();
            }, [], this);
        }, [], this);
    }

    playerSpeak(text, duration = 5000, fadeInSpeed = 1000, fadeOutSpeed = 500) {
        this.playerText = this.add.bitmapText(225, config.height - 79, "pixelFont", text, 24);
        this.playerText.alpha = 0;
        
        // Fade in
        this.tweens.add({
            targets: this.playerText,
            alpha: 1,
            duration: fadeInSpeed,
            ease: 'Bounce',
            repeat: 0
        });

        // Fade out
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
}