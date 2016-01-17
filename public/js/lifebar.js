function setLifeBar(game) {
	game.powerups = game.add.physicsGroup();
    
    game.lifeBarFill = game.add.sprite(29, 25, 'elamapalkki_tayte');
    game.lifeBarFill.fixedToCamera = true;
        
    game.lifeBar = game.add.sprite(25, 25, "elamapalkki");
    game.lifeBar.fixedToCamera = true;
        
    //var burana = new Burana(0,900);
    //game.powerups.add(burana);
};