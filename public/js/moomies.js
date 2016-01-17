function moomies(game) {
	game.moomins = game.add.physicsGroup();

    for (var i = 0; i < 10; i++) {
        var moomin = new Moomin(Math.random() * 800, Math.random() * 1000, game);
        game.moomins.add(moomin);
    }

    game.moominGibs = game.add.emitter(0, 0, "moomin_gibs", 150);
    game.moominGibs.makeParticles("moomin_gibs", [0, 1, 2, 3], 50, true, true);

    game.moominGibs.minParticleSpeed.setTo(-300, -50);
    game.moominGibs.maxParticleSpeed.setTo(300, -700);
    game.moominGibs.gravity = 800;
    game.moominGibs.angularDrag = 30;
    game.moominGibs.bounce.setTo(0.7, 0.7);
};