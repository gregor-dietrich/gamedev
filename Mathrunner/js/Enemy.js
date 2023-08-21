spawnEnemy = function(scene, platform) {
    if (gameSettings.enemySpawnChance < Phaser.Math.Between(1, 100)) {
        return;
    }
    var platformLength = platform.getChildren().length;
    var lastBlock = platform.getChildren()[platformLength - 1];
    
    var enemyNames = ["enemy-eagle", "enemy-possum", "enemy-frog-jump"];
    var enemyName = enemyNames[Phaser.Math.Between(0, enemyNames.length - 1)];
    
    // check if enemyName is in scene.lastEnemyNames array
    if (scene.lastEnemyNames.includes(enemyName)) {
        // if so, remove it from the array
        var temp = enemyNames;
        // remove all instances of scene.lastEnemyNames from temp
        for (var i = 0; i < scene.lastEnemyNames.length; i++) {
            temp = temp.filter(function(value, index, arr){ return value != scene.lastEnemyNames[i];});
        }
        // if temp is empty, all enemies have been spawned, so reset scene.lastEnemyNames
        if (temp.length == 0) {
            scene.lastEnemyNames = [];
            enemyName = enemyNames[Phaser.Math.Between(0, enemyNames.length - 1)];
            if (enemyName == scene.lastEnemySpawned) {
                temp = enemyNames;
                temp = temp.filter(function(value, index, arr){ return value != enemyName;});
                enemyName = temp[Phaser.Math.Between(0, temp.length - 1)];
            }
        }
        // otherwise, set enemyName to a random value from temp
        else {
            enemyName = temp[Phaser.Math.Between(0, temp.length - 1)];
        }
    }
    // add enemyName to scene.lastEnemyNames
    scene.lastEnemyNames.push(enemyName);
    scene.lastEnemySpawned = enemyName;

    // set enemyY based on enemyName
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

    // spawn enemy and add it to scene.enemies
    var enemy = new Enemy(scene, lastBlock.x - 50, enemyY, enemyName);
    scene.enemies.add(enemy);
    enemy.body.setVelocityX(scene.gamePaused ? 0 : -gameSettings.playerSpeed * 200);
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemyName) {
        super(scene, x, y, enemyName);
        this.scene = scene;
        this.spottedPlayer = false;
        this.enemyName = enemyName;
        
        this.play(enemyName + "_anim");
        this.setScale(2);

        this.scene.add.existing(this);
    }

    update() {
        if (this.x - this.scene.player.x < config.width - 250) {
            this.spotPlayer();
        }
    }

    spotPlayer() {
        if (this.spottedPlayer) {
            return;
        }
        this.spottedPlayer = true;
        if (this.scene.questionSound != null) {
            this.scene.questionSound.play();
        }
        
        // enemy spotted player
        this.scene.pauseGame();
        
        this.scene.tweens.add({
            targets: this,
            x: 300,
            duration: 1500,
            ease: 'Linear',
            repeat: 0,
            onComplete: () => {
                if (this.enemyName == "enemy-frog-jump") {
                    this.y = config.height - 54;
                    this.play("enemy-frog-idle_anim");
                }

                // enemy arrived at player
                this.scene.time.delayedCall(2000, () => {
                    if (this.scene.wrongSound != null) {
                        this.scene.wrongSound.play();
                    }

                    this.scene.time.delayedCall(1000, () => {                        
                        playerHurt(this.scene, gameSettings.questionPenalty);
                        
                        this.scene.time.delayedCall(2000, () => {
                            // enemy leaving
                            if (this.enemyName == "enemy-frog-jump") {
                                this.y = config.height - 64;
                                this.play("enemy-frog-jump_anim");
                            }
                            this.scene.tweens.add({
                                targets: this,
                                x: -100,
                                duration: 1000,
                                ease: 'Linear',
                                repeat: 0,
                                onComplete: () => {
                                    this.scene.enemies.remove(this);
                                    this.destroy();
                                }
                            });                    
                            this.scene.unpauseGame();
                        }, null, this);
                    }, null, this);
                }, null, this);
            }
        });
    }
}