class Scene3 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.paused = true;

        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.middleground = this.add.tileSprite(0, 120, config.width, config.height, 'middleground');
        setTileSpriteRepeating(this.background);
        setTileSpriteRepeating(this.middleground);

        this.createPlayer();

        this.props = this.physics.add.group();
        this.platformPool = this.add.group();

        this.createFirstPlatform();
        this.addPlatform();
        this.addPlatform();
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

        // remove first platform if it's off screen
        var firstPlatform = this.platformPool.getChildren()[0];
        if (firstPlatform.getChildren()[firstPlatform.getChildren().length - 1].x < -64) {
            this.platformPool.remove(firstPlatform);
            this.addPlatform();

            // clean up props
            for (var i = 0; i < this.props.getChildren().length; i++) {
                var prop = this.props.getChildren()[i];
                if (prop.x < -100) {
                    this.props.remove(prop);
                    prop.destroy();
                }
            }
        }
    }

    createFirstPlatform() {
        this.platformPool.add(createPlatform(this, 70));
        createProp(this, "bush", 100);
        createProp(this, "bush", 1420);
        createProp(this, "bush", 1650);
        createProp(this, "bush", 2100);
        createProp(this, "pine", 520);
        createProp(this, "palm", 310);
        createProp(this, "palm", 800);
        createProp(this, "palm", 1510);
        createProp(this, "palm", 1700);
        createProp(this, "tree", 1120);
        createProp(this, "tree", 2050);
        createProp(this, "tree2", 1310);
        createProp(this, "tree2", 2150);
        createProp(this, "rock", 710);
        createProp(this, "rock", 1750);
        createProp(this, "shrooms", 760);
        createProp(this, "shrooms", 1700);
    }

    addPlatform() {
        // get the last platform's last block's x position and add a random amount to it
        var lastPlatform = this.platformPool.getChildren()[this.platformPool.getChildren().length - 1];
        var nextPlatformX = lastPlatform.getChildren()[lastPlatform.getChildren().length - 1].x + Phaser.Math.Between(120, 250);

        // add a new platform with length between 20 and 50
        var platformLength = Phaser.Math.Between(20, 50);
        var platform = createPlatform(this, platformLength, nextPlatformX, true);
        platform.setVelocityX(this.paused ? 0 : -gameSettings.playerSpeed * 100);
        this.platformPool.add(platform);
        this.decoratePlatform(platform);
        this.props.setVelocityX(this.paused ? 0 : -gameSettings.playerSpeed * 100);
    }

    decoratePlatform(platform) {
        var platformLength = platform.getChildren().length;
        var platformX = platform.getChildren()[0].x;

        var maxBushes = Math.floor(platformLength / 10);
        var maxTrees = Math.floor(platformLength / 10);
        var maxRocks = Math.floor(platformLength / 20);
        var maxShrooms = Math.floor(platformLength / 20);

        this.addRandomProps(platformX, platformLength, maxBushes, ["bush"]);
        this.addRandomProps(platformX, platformLength, maxTrees, ["pine", "palm", "tree", "tree2"]);
        this.addRandomProps(platformX, platformLength, maxRocks, ["rock"]);
        this.addRandomProps(platformX, platformLength, maxShrooms, ["shrooms"]);
    }

    addRandomProps(platformX, platformLength, maxProps, propNames) {
        for (var i = 0; i < Phaser.Math.Between(maxProps/2, maxProps); i++) {
            var propName = propNames[Phaser.Math.Between(0, propNames.length - 1)];
            var prop = createProp(this, propName, platformX + Phaser.Math.Between(100, platformLength * 32 - 100));
            prop.body.setVelocityX(this.paused ? 0 : -gameSettings.playerSpeed * 100);        
        }
    }

    gameOver() {
        this.pauseGame();
        this.player.body.enable = false;

        this.time.delayedCall(2000, function() {
            this.title = this.add.bitmapText(config.width / 2 - 84, 50, "pixelFont", "GAME OVER", 48);
            this.title.tint = 0x000000;

            this.time.delayedCall(2000, function() {
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

        for (var i = 0; i < this.platformPool.getChildren().length; i++) {
            this.platformPool.getChildren()[i].setVelocityX(0);
        }    
        this.props.setVelocityX(0);

        this.player.play("player-idle_anim");
    }

    unPauseGame() {
        this.paused = false;

        for (var i = 0; i < this.platformPool.getChildren().length; i++) {
            this.platformPool.getChildren()[i].setVelocityX(-gameSettings.playerSpeed * 100);
        }
        this.props.setVelocityX(-gameSettings.playerSpeed * 100);
        
        this.player.play("player-run_anim");
    }

    createPlayer() {
        // Add the player sprite
        this.player = this.physics.add.sprite(-33, config.height - 64, "player-run");
        this.player.setScale(2);
        this.player.play("player-run_anim");
        this.player.depth = 1;

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