function setCollisions(game, player, mapLayer) {
	game.physics.arcade.collide(player.sprite, mapLayer);
    game.physics.arcade.collide(player.sprite, game.levelObstacles);

    game.physics.arcade.collide(game.moomins, mapLayer);
    game.physics.arcade.collide(game.moomins, game.levelObstacles);

    game.physics.arcade.collide(game.moominGibs, mapLayer);
    game.physics.arcade.collide(game.moominGibs, game.levelObstacles);

    game.physics.arcade.collide(game.enemyBullets, mapLayer, game.killBullets, null, game);
        
    game.physics.arcade.overlap(game.moomins, player.sprite, game.moominTouchPlayer, null, game);

    /*game.moomins.update();
    game.enemyBullets.update();
    game.moominGibs.update();*/
};