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
            ease: 'Power2',
            repeat: 0,
            onComplete: () => {
                // enemy arrived at player
                if (this.scene.wrongSound != null) {
                    this.scene.wrongSound.play();
                }
                this.scene.time.delayedCall(1000, () => {
                    this.scene.playerHurt(gameSettings.questionPenalty);
                    if (this.enemyName == "enemy-frog-jump") {
                        this.y = config.height - 54;
                        this.play("enemy-frog-idle_anim");
                    }
                    this.scene.time.delayedCall(5000, () => {
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
                                this.destroy();
                            }
                        });                    
                        this.scene.unpauseGame();
                    }, null, this);
                }, null, this);
            }
        });
    }
}