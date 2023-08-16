class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        // this.background = this.add.image(0,0, "background");
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0,0);

        /* this.add.text(20, 20, "Playing game", {
            font: "25px Arial",
            fill: "yellow"
        }); */

        // this.ship1 = this.add.image(config.width/2 - 50, config.height/2, "ship1");
        // this.ship2 = this.add.image(config.width/2, config.height/2, "ship2");
        // this.ship3 = this.add.image(config.width/2 + 50, config.height/2, "ship3");
        // this.ship1.setScale(2);
        // this.ship1.flipY = true;

        this.projectiles = this.add.group();
        this.enemies = this.physics.add.group();
        this.powerUps = this.physics.add.group();

        this.enemies.add(this.physics.add.sprite(config.width/2 - 50, config.height/2, "ship1"));
        this.enemies.add(this.physics.add.sprite(config.width/2, config.height/2, "ship2"));
        this.enemies.add(this.physics.add.sprite(config.width/2 + 50, config.height/2, "ship3"));
        for (var i = 0; i < this.enemies.getChildren().length; i++) {
            var ship = this.enemies.getChildren()[i];
            ship.play("ship" + (i+1) + "_anim");
        }

        this.player = this.physics.add.sprite(config.width/2 - 8, config.height - 32, "player");
        this.player.play("thrust");
        this.player.setCollideWorldBounds(true);
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Destroy on click
        for (var i = 0; i < this.enemies.getChildren().length; i++) {
            var ship = this.enemies.getChildren()[i];
            ship.setInteractive();
        }
        this.input.on('gameobjectdown', this.destroyShip, this);

        for (var i = 0; i < 3; i++) {
            var powerUp = this.physics.add.sprite(16, 16, "powerup");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, config.width, config.height);

            if (Math.random() > 0.5) {
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }

            powerUp.setVelocity(100, 100);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }

        this.physics.add.collider(this.powerUps, this.powerUps);
        this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
            projectile.destroy();
        });
        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

        var graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(0,0);
        graphics.lineTo(config.width, 0);
        graphics.lineTo(config.width, 20);
        graphics.lineTo(0, 20);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();

        this.score = 0;
        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE: 000000", 16);

        this.beamSound = this.sound.add("audio_beam");
        this.explosionSound = this.sound.add("audio_explosion");
        this.pickupSound = this.sound.add("audio_pickup");

        /* this.music = this.sound.add("music");
        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.music.play(musicConfig); */
    }

    update() {
        // this.ship1.angle += 3;
        for (var i = 0; i < this.enemies.getChildren().length; i++) {
            var ship = this.enemies.getChildren()[i];
            this.moveShip(ship, 1);
        }

        this.background.tilePositionY -= 0.5;

        this.movePlayerManager();
        
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.shootBeam();
        }

        for (var i = 0; i < this.projectiles.getChildren().length; i++) {
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }
    }

    zeroPad(number, size) {
        var stringNumber = String(number);
        while(stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }

    hitEnemy(projectile, enemy) {
        var explosion = new Explosion(this, enemy.x, enemy.y);
        projectile.destroy();
        this.resetShipPos(enemy);
        this.score += 25;
        this.scoreLabel.text = "SCORE: " + this.zeroPad(this.score, 6);
    }

    hurtPlayer(player, enemy) {
        if (this.player.alpha < 1) {
            return;
        }

        var explosion_enemy = new Explosion(this, enemy.x, enemy.y);
        this.resetShipPos(enemy);
        
        var exlposion_player = new Explosion(this, player.x, player.y);
        player.disableBody(true, true);

        this.time.addEvent({
            delay: 5000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        });
    }

    resetPlayer() {
        this.score = 0;
        this.scoreLabel.text = "SCORE: 000000";
        var x = config.width / 2 - 8;
        var y = config.height;
        this.player.enableBody(true, x, y, true, true);
        for (var i = 0; i < this.enemies.getChildren().length; i++) {
            var ship = this.enemies.getChildren()[i];
            this.resetShipPos(ship);
        }

        this.player.alpha = 0.5;
        var tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: "Power1",
            duration: 1500,
            repeat: 0,
            onComplete: function() {
                this.player.alpha = 1;
            },
            callbackScope: this
        });
    }

    pickPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);
        this.pickupSound.play();
    }

    shootBeam() {
        if (!this.player.active || this.player.alpha < 1 || this.projectiles.getChildren().length > 9) {
            return;
        }
        // var beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
        var beam = new Beam(this);
    }

    movePlayerManager() {
        this.player.setVelocity(0);

        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
        }
        if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
        }
        if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed);
        } 
        if (this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed);
        }        
    }

    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > config.height) {
            this.resetShipPos(ship);
        }
    }

    resetShipPos(ship) {
        ship.y = -128;
        var randomX = Phaser.Math.Between(0, config.width);
        ship.x = randomX;
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explosion");
    }
}