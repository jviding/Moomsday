function loadMap(game) {

    game.obstacle = game.add.sprite(40, 400, 'map');
    game.physics.enable(game.obstacle, Phaser.Physics.ARCADE);
    game.obstacle.body.collideWorldBounds = true;
    game.obstacle.body.allowGravity = false;
    game.obstacle.body.immovable = true;

    game.backgroundLayer = null;
    game.mapLayer = null;
    game.levelObstacles = game.add.physicsGroup();

	var map = game.add.tilemap('map');
	map.addTilesetImage('tiles');

    //map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

	bgLayer = map.createLayer('Background Layer');
	mapLayer = map.createLayer('Main Layer');
	mapLayer.resizeWorld();

    map.setCollision([0, 1, 2, 3, 4, 8, 11, 13, 14, 16, 17, 18], true, 'Main Layer');

    return mapLayer;

};