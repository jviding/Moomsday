function Player(x, y, game) {
    this.direction = "right";
    
    this.sprite = game.add.sprite(x, y, "player");
    //this.sprite.anchor.setTo(0.5, 0.5);
    
    this.sprite.animations.add("idle", [0], 1, true);
    this.sprite.animations.add("walk", [0,1,2,3], 8, true);
    
    this.sprite.animations.play("idle");
    
    game.camera.follow(this.sprite);
    
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.sprite.body.collideWorldBounds = true;
    
    this.laserTimer = 0;
    
    this.lasers = game.add.physicsGroup();
}

Player.prototype = {
    die: function() {
        var state = game.state.getCurrentState();
        
        state.playerGibs.x = this.sprite.x + 16;
        state.playerGibs.y = this.sprite.y + 16;
        
        state.playerGibs.start(true, 9000, 0, 20);
        
        this.sprite.kill();
    },
    
    shootLaser: function() {
        var laser = game.make.sprite(this.sprite.x, this.sprite.y, "laser");
        this.lasers.add(laser);
        
        laser.body.allowGravity = false;
        laser.body.velocity.x = this.direction === "right" ? 700 : -700;
        laser.x += this.direction === "right" ? 30 : -20;
        laser.outOfBoundsKill = true;
    },
    
    laserMapOverlap: function(laser, map) {
        laser.kill();
    },
    
    laserMoominOverlap: function(laser, moomin) {
        laser.kill();
        moomin.damage(25);
    }
};