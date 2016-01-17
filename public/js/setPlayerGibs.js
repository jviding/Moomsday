function setPlayerGibs(game) {

	game.playerGibs = game.add.emitter(0, 0, "player_gibs", 50);
    game.playerGibs.makeParticles("player_gibs", [0, 1, 2, 3], 50, true, true);

    game.playerGibs.minParticleSpeed.setTo(-300, -50);
    game.playerGibs.maxParticleSpeed.setTo(300, -700);
    game.playerGibs.gravity = 800;
    game.playerGibs.angularDrag = 30;
    game.playerGibs.bounce.setTo(0.7, 0.7);

    game.playerHeadGibs = game.add.emitter(0, 0, "player_head", 1);
    game.playerHeadGibs.makeParticles("player_gibs", [0, 1, 2, 3], 50, true, true);

    game.playerHeadGibs.minParticleSpeed.setTo(-300, -50);
    game.playerHeadGibs.maxParticleSpeed.setTo(300, -700);
    game.playerHeadGibs.gravity = 600;
    game.playerHeadGibs.angularDrag = 90;
    game.playerHeadGibs.particleDrag = 90;
    game.playerHeadGibs.bounce.setTo(0.8, 0.8);
};