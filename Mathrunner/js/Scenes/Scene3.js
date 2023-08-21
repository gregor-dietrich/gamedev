// TO DO: 
// Add questions when enemies arrive
// Add spike traps 50% chance of appearing if platform is longer than 30 blocks
// Add items, 50% chance of appearing for every 10 blocks of platform length
// Add sounds: cherry, gem, correct answer
// Add music
class Scene3 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.gamePaused = true;
        this.timePassed = 0;
        this.score = 0;
        this.penalty = 0;
        this.lastEnemySpawned = 0;

        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.middleground = this.add.tileSprite(0, 120, config.width, config.height, 'middleground');
        setTileSpriteRepeating(this.background);
        setTileSpriteRepeating(this.middleground);

        this.props = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.platformPool = this.add.group();

        this.createSounds();
        this.createTopBar();
        this.createPlayer();

        this.createFirstPlatform();
        this.addPlatform();
        this.addPlatform();
    }

    update() {
        if (this.player.y > config.height - 24) {
            this.gameOver();
        }

        if (this.gamePaused) { 
            return;
        }

        // score keeping
        this.timePassed += 1;
        if (this.timePassed % 10 == 0) {
            this.score = Math.floor(this.timePassed * gameSettings.scorePerSecond / 60);
            this.updateScoreLabel();
        }

        // move the background
        this.background.tilePositionX += gameSettings.playerSpeed * 0.5;
        this.background.tilePositionY = Math.sin(this.background.tilePositionX / 100);
        this.middleground.tilePositionX += gameSettings.playerSpeed * 1.5;

        // jump if spacebar is pressed
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
            this.playerJump();
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

        // update enemies
        for (var i = 0; i < this.enemies.getChildren().length; i++) {
            var enemy = this.enemies.getChildren()[i];
            enemy.update();
        }
    }

    updateScoreLabel() {
        var labelText = this.score - this.penalty < 0 ? 0 : this.score - this.penalty;
        this.scoreLabel.text = "SCORE: " + this.zeroPad(labelText, 6);
    }

    createSounds() {
        this.jumpSound = null;
        this.hurtSound = null;
        this.cherrySound = null;
        this.gemSound = null;
        this.correctSound = null;
        this.wrongSound = null;
        this.questionSound = null;
        this.bgmSound = null;
        // don't load audio if iOS
        if (this.sys.game.device.os.iOS) {
            return;
        }

        this.jumpSound = this.sound.add("audio_jump", sfxConfig);
        this.hurtSound = this.sound.add("audio_hurt", sfxConfig);
        this.cherrySound = this.sound.add("audio_cherry", sfxConfig);
        this.gemSound = this.sound.add("audio_gem", sfxConfig);
        this.correctSound = this.sound.add("audio_correct", sfxConfig);
        this.wrongSound = this.sound.add("audio_wrong", sfxConfig);
        this.questionSound = this.sound.add("audio_question", sfxConfig);
        this.bgmSound = this.sound.add("audio_bgm", musicConfig);
    }

    createTopBar() {
        this.topBar = this.add.graphics();
        this.topBar.alpha = 0;
        this.topBar.fillStyle(0x000000, 1);
        this.topBar.beginPath();
        this.topBar.moveTo(0,0);
        this.topBar.lineTo(config.width, 0);
        this.topBar.lineTo(config.width, 40);
        this.topBar.lineTo(0, 40);
        this.topBar.lineTo(0, 0);
        this.topBar.closePath();
        this.topBar.fillPath();

        this.scoreLabel = this.add.bitmapText(10, 12, "pixelFont", "SCORE: 000000", 24); 
        this.scoreLabel.alpha = 0; 
        this.scoreLabel.tint = 0xFFFFFF;
        this.scoreLabel.depth = 2;

        this.jumpButton = this.add.bitmapText(config.width - 100, 10, "pixelFont", "JUMP", 36);
        this.jumpButton.alpha = 0;
        this.jumpButton.tint = 0xFFFFFF;
        this.jumpButton.depth = 2;
        this.jumpButton.setInteractive();
        this.jumpButton.on('pointerdown', function(pointer) {
            this.playerJump();
        }, this);

        this.pauseButton = this.add.bitmapText(config.width - 220, 10, "pixelFont", "PAUSE", 36);
        this.pauseButton.alpha = 0;
        this.pauseButton.tint = 0xFFFFFF;
        this.pauseButton.depth = 2;
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', function(pointer) {
            if (!this.gamePaused) {
                this.playerPause();
            }
        }, this);
    }

    zeroPad(number, size) {
        var stringNumber = String(number);
        while(stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }

    showTopBar() {
        this.tweens.add({
            targets: this.topBar,
            alpha: 0.5,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.scoreLabel,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.jumpButton,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.pauseButton,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
    }

    hideTopBar() {
        this.tweens.add({
            targets: this.scoreLabel,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.topBar,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.jumpButton,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.pauseButton,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
    }

    gameOver() {
        this.pauseGame();

        this.time.delayedCall(2000, function() {
            var title = this.add.bitmapText(config.width / 2 - 84, 50, "pixelFont", "GAME OVER", 48);
            title.tint = 0x000000;

            var restartLabel = this.add.bitmapText(config.width / 2 - 80, 90, "pixelFont", "Click/Tap to restart", 24);
            restartLabel.alpha = 0;
            restartLabel.tint = 0x000000;
            
            this.player.body.enable = false;
            this.player.body.gravity.y = 0;
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);

            this.time.delayedCall(1000, function() {
                this.tweens.add({
                    targets: restartLabel,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Power2',
                    yoyo: true,
                    repeat: -1
                });

                this.input.on('pointerdown', function(pointer) {
                    this.bgmSound.stop();
                    title.destroy();
                    restartLabel.destroy();
                    this.input.removeAllListeners();
                    this.scene.start("playGame");
                }, this);
            }, [], this);
        }, [], this);        
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
        var nextPlatformX = lastPlatform.getChildren()[lastPlatform.getChildren().length - 1].x + Phaser.Math.Between(gameSettings.platformGapMin, gameSettings.platformGapMax);

        // add a new platform with length between 20 and 50
        var platformLength = Phaser.Math.Between(gameSettings.platformLengthMin, gameSettings.platformLengthMax);
        var platform = createPlatform(this, platformLength, nextPlatformX, true);
        platform.setVelocityX(this.gamePaused ? 0 : -gameSettings.playerSpeed * 200);
        this.platformPool.add(platform);

        // decorate the platform
        this.decoratePlatform(platform);
        if (this.enemies.getChildren().length == 0 && this.timePassed - this.lastEnemySpawned > gameSettings.enemySpawnRate * 60) {
            this.spawnEnemy(platform);
        }
    }

    decoratePlatform(platform) {
        var platformLength = platform.getChildren().length;
        var platformX = platform.getChildren()[0].x;

        var maxBushes = gameSettings.propDensity * Math.floor(platformLength / 10);
        var maxTrees = gameSettings.propDensity * Math.floor(platformLength / 10);
        var maxRocks = gameSettings.propDensity * Math.floor(platformLength / 15);
        var maxShrooms = gameSettings.propDensity * Math.floor(platformLength / 15);

        this.addRandomProps(platformX, platformLength, maxBushes, ["bush"]);
        this.addRandomProps(platformX, platformLength, maxRocks, ["rock"]);
        this.addRandomProps(platformX, platformLength, maxTrees, ["pine", "palm", "tree", "tree2"]);
        this.addRandomProps(platformX, platformLength, maxShrooms, ["shrooms"]);
        
        this.props.setVelocityX(this.gamePaused ? 0 : -gameSettings.playerSpeed * 200);
    }

    spawnEnemy(platform) {        
        this.lastEnemySpawned = this.timePassed;
        var platformLength = platform.getChildren().length;
        var lastBlock = platform.getChildren()[platformLength - 1];
        
        var enemyNames = ["enemy-eagle", "enemy-possum", "enemy-frog-jump"];
        var enemyName = enemyNames[Phaser.Math.Between(0, enemyNames.length - 1)];
        var enemyY = config.height;
        switch (enemyName) {
            case "enemy-eagle":
                enemyY -= 100;
                break;
            case "enemy-frog-jump":
                enemyY -= 64;
                break;
            case "enemy-possum":
                enemyY -= 60;
                break;
        }

        var enemy = new Enemy(this, lastBlock.x - 50, enemyY, enemyName);
        this.enemies.add(enemy);
        enemy.body.setVelocityX(this.gamePaused ? 0 : -gameSettings.playerSpeed * 200);
    }

    addRandomProps(platformX, platformLength, maxProps, propNames) {
        for (var i = 0; i < Phaser.Math.Between(Math.floor(maxProps/2), maxProps); i++) {
            var propName = propNames[Phaser.Math.Between(0, propNames.length - 1)];
            var prop = createProp(this, propName, platformX + Phaser.Math.Between(50, platformLength * 32 - 100));
            if (Phaser.Math.Between(0, 1) == 1) {
                prop.flipX = true;
            }
            prop.body.setVelocityX(this.gamePaused ? 0 : -gameSettings.playerSpeed * 200);        
        }
    }

    createPlayer() {
        // Add the player sprite
        this.player = this.physics.add.sprite(-33, config.height - 64, "player-run");
        this.player.setScale(2);
        this.player.play("player-run_anim");
        this.player.depth = 1;

        // Enable physics on the player
        this.physics.world.enable(this.player);
        this.player.body.gravity.y = gameSettings.playerGravity;

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
                this.unpauseGame();
                if (this.bgmSound != null) {
                    this.bgmSound.play();
                }
            }, [], this);
        }, [], this);
    }

    playerJump() {
        if (this.player.body.touching.down) {
            this.player.setVelocityY(-gameSettings.playerJumpHeight);
            this.player.play("player-jump_anim");
            if (this.jumpSound != null) {
                this.jumpSound.play();
            }
            this.time.delayedCall(1200, function() {
                this.player.play(this.gamePaused ? "player-idle_anim" : "player-run_anim");
            }, [], this);
        }
    }

    playerHurt(scorePenalty = 0) {
        this.penalty += scorePenalty;
        this.updateScoreLabel();
        this.player.play("player-hurt_anim");
        if (this.hurtSound != null) {
            this.hurtSound.play();
        }
        this.player.setVelocityY(-gameSettings.playerJumpHeight);
        this.time.delayedCall(1200, function() {
            this.player.play(this.gamePaused ? "player-idle_anim" : "player-run_anim");
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

    playerPause() {
        this.pauseGame();

        var gamePausedText = this.add.bitmapText(config.width / 2 - 100, 50, "pixelFont", "GAME PAUSED", 48);
        gamePausedText.tint = 0x000000;

        var unpauseText = this.add.bitmapText(config.width / 2 - 80, 90, "pixelFont", "Click/Tap to resume", 24);
        unpauseText.alpha = 0;
        unpauseText.tint = 0x000000;

        this.time.delayedCall(1000, function() {
            this.tweens.add({
                targets: unpauseText,
                alpha: 1,
                duration: 1500,
                ease: 'Power2',
                yoyo: true,
                repeat: -1,
                autoStart: true
            });

            this.input.on('pointerdown', function(pointer) {
                this.unpauseGame();
                gamePausedText.destroy();
                unpauseText.destroy();
                this.input.removeAllListeners();
            }, this);
        }, [], this);
    }

    pauseGame() {
        this.gamePaused = true;
        this.hideTopBar();

        for (var i = 0; i < this.platformPool.getChildren().length; i++) {
            this.platformPool.getChildren()[i].setVelocityX(0);
        }    
        this.props.setVelocityX(0);
        this.enemies.setVelocityX(0);

        this.player.play("player-idle_anim");
    }

    unpauseGame() {
        this.gamePaused = false;
        this.showTopBar();

        for (var i = 0; i < this.platformPool.getChildren().length; i++) {
            this.platformPool.getChildren()[i].setVelocityX(-gameSettings.playerSpeed * 200);
        }
        this.props.setVelocityX(-gameSettings.playerSpeed * 200);
        this.enemies.setVelocityX(-gameSettings.playerSpeed * 200);
        
        this.player.play("player-run_anim");
    }
}