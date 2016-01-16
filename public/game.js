var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-game', 
    { preload: preload, create: create, update: update, render: render });

var hashmap = new HashMap();
var socket = io();
var socketId = null;
var lastEmit = Date.now();

function preload() {

    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('droid', 'assets/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/star.png');
    game.load.image('starBig', 'assets/star2.png');
    game.load.image('background', 'assets/background2.png');

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

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    socket.emit('join');

}

function update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

    //update players on the screen
    if (Date.now() - lastEmit > 100) {
        for (var i=0; i<allPlayers.length; i++) {
            allPlayers[i].reset(allPlayersData[i].x, allPlayersData[i].y);
        }
    }

    //location
    if (Date.now() - lastEmit > 100) {
        socket.emit('player', {'x': player.x, 'y': player.y});
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
    var p = game.add.sprite(32,32,'dude');
    allPlayers.push(p);
});

socket.on('get join', function (data) {
    socketId = data.id;
    for (var i=data.players-1; i>0; i--) {
        var p = game.add.sprite(32,32,'dude');
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