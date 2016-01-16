var game = new Phaser.Game(800, 600, Phaser.AUTO, "phaser-game", {
    preload: preload,
    create: create,
    update: update
}, false, false);

var hashmap = new HashMap();
var socket = io();
var socketId = null;
var lastEmit = Date.now();

function preload() {
    game.load.image('testiKuva', 'assets/img/shite.png');
    game.load.image('laser', 'assets/img/laaseri.png');
    game.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('player', 'assets/img/sankari.png', 23, 31);
    game.load.spritesheet('tiles', 'assets/img/tilet.png', 32, 32);
    game.load.spritesheet('tiles', 'assets/img/tilet.png', 32, 32);
    game.load.spritesheet('moomins', 'assets/img/tyypit.png', 32, 32);
    game.load.spritesheet('moomin_gibs', 'assets/img/muuminpalaset.png', 8, 8);
    game.load.spritesheet('player_gibs', 'assets/img/muuminpalaset.png', 8, 8);
    game.load.spritesheet('bullets', 'assets/img/bullets.png', 8, 4);
}

var map;
var tileset;
var layer;
var player;
var allPlayers = [];
var allPlayersData = [];
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#55FFAA';

    game.physics.arcade.gravity.y = 800;
    game.world.height = 3000;
    game.world.width = 1200;

    layer = loadMap(game);
    player = new Player(32, 32, game);
    moomies(game);
    setPlayerGibs(game);
    setCollisions(game, player);

    socket.emit('join');

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    dieButton = game.input.keyboard.addKey(Phaser.Keyboard.C);

}

function update() {

    //game.physics.arcade.collide(game.lasers, game.mapLayer, game.laserMapOverlap, null, game);
    //game.physics.arcade.overlap(game.lasers, game.moomins, game.laserMoominOverlap, null, game);

    setCollisions(game, player, layer);

    if (dieButton.isDown) {
        player.die();
    }

    player.sprite.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.sprite.animations.play("walk");
        player.sprite.body.velocity.x = -400;
        player.sprite.scale.x = -1;
        player.direction = "left";
    }
    else if (cursors.right.isDown)
    {
        player.sprite.animations.play("walk");
        player.sprite.body.velocity.x = 400;
        player.sprite.scale.x = 1;
        player.direction = "right";
    }
    else
    {
        player.sprite.animations.play("idle");
        player.sprite.body.velocity.x = 0;
    }
    
    if (jumpButton.isDown && player.sprite.body.onFloor() && game.time.now > jumpTimer)
    {
        player.sprite.body.velocity.y = -280;
    }

    //update players on the screen
    if (Date.now() - lastEmit > 100) {
        for (var i=0; i<allPlayers.length; i++) {
            allPlayers[i].reset(allPlayersData[i].x, allPlayersData[i].y);
        }
    }

    //location
    if (Date.now() - lastEmit > 100) {
        socket.emit('player', {'x': player.sprite.x, 'y': player.sprite.y});
        lastEmit = Date.now();
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

socket.on('new player', function () {
    console.log('a player joined');
    var p = game.add.sprite(32,32,'player');
    allPlayers.push(p);
});

socket.on('get join', function (data) {
    socketId = data.id;
    for (var i=data.players-1; i>0; i--) {
        var p = game.add.sprite(32,32,'player');
        allPlayers.push(p);
    }
});

socket.on('update', function (data) {
    allPlayersData = [];
    data['players'].forEach(function (playerData) {
        if (playerData.id !== socketId) {
            allPlayersData.push(playerData.location);
        }
    });
});

socket.on('disconnected', function (data) {
    console.log('a player has left');
    allPlayers.pop().destroy();
});