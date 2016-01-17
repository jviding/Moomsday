function Other(game, moomid, socket) {
    this.id = moomid;

    var state = game.state.getCurrentState();

    //Phaser.Sprite.call(this, game, 0, 0, "player");
    this.sprite = game.add.sprite(0, 0, "player");

    this.sprite.anchor.setTo(0.5, 0.5);
    this.direction = "right";

    this.sprite.animations.add("idle", [0], 1, true);
    this.sprite.animations.add("walk", [0,1,2,3], 8, true);
    
    this.sprite.animations.play("idle");

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;

};

Other.prototype = Object.create(Phaser.Sprite.prototype);
Other.prototype.constructor = Other;
Other.prototype.die = function() {
    game.playerGibs.x = this.sprite.x + 16;
    game.playerGibs.y = this.sprite.y + 16;
    game.playerGibs.start(true, 9000, 0, 20);
    // socketilla emit this.id koska rikki
};
Other.prototype.shoot = function() {
    //this.die();
};
Other.prototype.update = function(cords) {
    this.sprite.reset(cords.x, cords.y);
};