function setCollisions(game, player, mapLayer) {

    //hashmap.forEach(function (value, key) {
    //    game.physics.arcade.overlap(player.lasers, value, player.shootPlayer, null, game);
    //});

    game.physics.arcade.collide(player.lasers, layer, player.laserMapOverlap, null, game);
    game.physics.arcade.overlap(player.lasers, game.moomins, player.laserMoominOverlap, null, game);

	game.physics.arcade.collide(player.sprite, mapLayer);
    game.physics.arcade.collide(player.sprite, game.levelObstacles);

    game.physics.arcade.collide(game.playerGibs, mapLayer);
    game.physics.arcade.collide(game.playerGibs, game.levelObstacles);

    game.physics.arcade.collide(game.playerHeadGibs, mapLayer);
    game.physics.arcade.collide(game.playerHeadGibs, game.levelObstacles);

    game.physics.arcade.collide(game.moomins, mapLayer);
    game.physics.arcade.collide(game.moomins, game.levelObstacles);

    game.physics.arcade.collide(game.moominGibs, mapLayer);
    game.physics.arcade.collide(game.moominGibs, game.levelObstacles);

    game.physics.arcade.collide(game.enemyBullets, mapLayer, game.killBullets, null, game);
    //game.physics.arcade.overlap(this.enemyBullets, this.player.sprite, this.bulletHitPlayer, null, this);

    game.physics.arcade.overlap(player.sprite, game.moomins, player.moominTouchPlayer, null, game);
    //game.physics.arcade.overlap(this.player.sprite, this.powerups, this.playerTouchPowerup, null, this);

    //game.moomins.update();
    //game.enemyBullets.update();
    //game.moominGibs.update();
};