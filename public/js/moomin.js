MUUMIPEIKKO = 0;
MUUMIPAPPA = 2;
MUUMIMAMMA = 6;
NIISKUNEITI = 8;
EN_MUISTA_TAMAN_TYYPIN_NIMEA = 10;

function Moomin(x, y, game, type) {
    var randomNumber = Math.ceil(Math.random() * 30);
        
    if (randomNumber >= 1 && randomNumber <= 10) {
        this.enemyType = MUUMIPEIKKO;
    } else if (randomNumber >= 11 && randomNumber <= 14) {
        this.enemyType = MUUMIPAPPA;
    } else if (randomNumber >= 15 && randomNumber <= 21) {
        this.enemyType = MUUMIMAMMA;
    } else if (randomNumber >= 22 && randomNumber <= 26) {
        this.enemyType = NIISKUNEITI;
    } else {
        this.enemyType = EN_MUISTA_TAMAN_TYYPIN_NIMEA;
    }

    var state = game.state.getCurrentState();

    Phaser.Sprite.call(this, game, x, y, "moomins", type);
    this.health = 50;
    this.anchor.setTo(0.5, 0.5);
    this.direction = "right";
    
    this.animations.add("idle", [this.enemyType]);
    this.animations.add("walk", [this.enemyType, this.enemyType+1], 4, true);
    
    this.animations.play("idle");

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    
    this.gunTimer = 0;
    this.followTimer = 0;
    this.wanderTimer = 0;
    
    this.destroyed = false;
    this.wandering = true;
}

Moomin.prototype = Object.create(Phaser.Sprite.prototype);
Moomin.prototype.constructor = Moomin;
Moomin.prototype.die = function() {
    game.moominGibs.x = this.x + 16;
    game.moominGibs.y = this.y + 16;
    game.moominGibs.start(true, 4500, 0, 10);
    //this.kill();
    this.destroyed = true;
    this.destroy();
};
Moomin.prototype.bulletHitMoomin = function() {
    this.die();
};
Moomin.prototype.update = function() {
    if (this.destroyed) {
        return;
    }

    if (this.health <= 0 || this.y >= 2030) {
        this.die();
        return;
    }
    
    if (this.body.velocity.x !== 0) {
        this.animations.play("walk");
    } else {
        this.animations.play("idle");
    }

    var state = game.state.getCurrentState();

    if (this.direction === "right") {
        this.scale.x = -1;
    } else {
        this.scale.x = 1;
    }
    
    // Following
    var yDistance = Math.abs(player.sprite.y - this.y);
    var xDistance = Math.abs(player.sprite.x - this.x);

    if (!player.dead && xDistance < 400 && yDistance < 150) {
        this.wandering = false;
        this.followTimer = game.time.now;
        
        if (player.sprite.x <= this.x) {
            this.direction = "left";
        } else {
            this.direction = "right";
        }

        if (this.direction === "left") {
            this.body.velocity.x = -80;
        } else {
            this.body.velocity.x = 80;
        }

        if (((this.body.blocked.left && this.direction === "left") ||
             (this.body.blocked.right && this.direction === "right")) &&
             this.body.blocked.down) {
            this.body.velocity.y = -280;
        }
    } else {
        // Keep moving for a while even if the player is lost
        if (this.followTimer > game.time.now - 800) {
            this.body.velocity.x = 0;
            this.wandering = true;
        }
    }

    if (this.wandering && game.time.now > this.wanderTimer + 1500) {
        // If moomin was already moving, stop
        if (this.body.velocity.x !== 0) {
            this.body.velocity.x = 0;
            this.wanderTimer = game.time.now + Math.ceil(Math.random() * 400);
            return;
        } else {
            var randomNumber = Math.ceil(Math.random() * 2);

            if (randomNumber === 1) {
                this.body.velocity.x = 125 + Math.ceil(Math.random() * 50);
                this.wanderTimer = game.time.now + Math.ceil(Math.random() * 400) + 1200;
                this.direction = "right";
            } else if (randomNumber === 2) {
                this.body.velocity.x = -125 - Math.ceil(Math.random() * 50);
                this.wanderTimer = game.time.now + Math.ceil(Math.random() * 400) + 1200;
                this.direction = "left";
            }
        }
    }

    // Shooting
    /*if (!state.player.dead && this.enemyType === MUUMIPAPPA && game.time.now > this.gunTimer + 200 && yDistance < 80) {
        var bullet = game.make.sprite(this.x, this.y, "bullets", 0);

        state.enemyBullets.add(bullet);

        bullet.body.allowGravity = false;

        if (this.direction === "right") {
            bullet.body.velocity.x = 800;
        } else {
            bullet.body.velocity.x = -800;
        }

        this.gunTimer = game.time.now;
    }*/
};