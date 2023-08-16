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

        this.player = this.physics.add.sprite(config.width/2 - 8, config.height - 64, "player");
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

        for (var i = 0; i < 4; i++) {
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

    hitEnemy(projectile, enemy) {
        projectile.destroy();
        this.resetShipPos(enemy);
    }

    hurtPlayer(player, enemy) {
        this.resetShipPos(enemy);
        player.x = config.width / 2 - 8;
        player.y = config.height - 64;
    }

    pickPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);
    }

    shootBeam() {
        if (this.projectiles.getChildren().length > 3) {
            return;
        }
        // var beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
        var beam = new Beam(this);
        this.projectiles.add(beam);
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