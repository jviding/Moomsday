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
    game.load.image('elamapalkki', 'assets/img/elamapalkki.png');
    game.load.image('elamapalkki_tayte', 'assets/img/elamapalkki_tayte.png');
    game.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('burana', 'assets/img/burana.png', 31, 9);
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
var moomins;
var allPlayers = [];
var allPlayersData = [];
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var shootButton;
var laserTimer = Date.now();
var bg;
var moomSpawn = Date.now();

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#55FFAA';

    game.physics.arcade.gravity.y = 800;
    game.world.height = 3000;
    game.world.width = 1200;

    layer = loadMap(game);
    player = new Player(32, 32, game);
    game.enemyBullets = game.add.physicsGroup();
    game.otherPlayers = game.add.physicsGroup();
    moomins = moomies(game);
    setLifeBar(game);
    setPlayerGibs(game);

    //game.nukeTimer = 0;

    socket.emit('join');

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    dieButton = game.input.keyboard.addKey(Phaser.Keyboard.C);
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.X);

}

function update() {

    setCollisions(game, player, layer, hashmap);

    if (dieButton.isDown) {
        player.die(game);
    }

    if (shootButton.isDown && Date.now() > laserTimer + 500) {
            laserTimer = Date.now();
            player.shootLaser(game);
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

    //check if player is hit
    hashmap.forEach(function (other) {
        player.lasers.forEach(function (bom) {
            if (Phaser.Rectangle.intersects(bom.getBounds(), other.sprite.getBounds())) {
                bom.destroy();
                other.die();
            };
        });
    });

    //update players on the screen
    if (Date.now() - lastEmit > 100) {
        allPlayersData.forEach(function (item) {
            var bob = hashmap.get(item.id);
            if (bob !== undefined) {
                bob.update(item.location);
            }
        });
    }

    //location
    if (Date.now() - lastEmit > 50) {
        socket.emit('player', {'x': player.sprite.x, 'y': player.sprite.y});
        lastEmit = Date.now();
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

socket.on('new player', function (data) {
    console.log('a player has joined');
    var p = new Other(game, data.id);
    hashmap.set(data.id, p);
});

socket.on('get join', function (data) {
    socketId = data.id;
    data.players.forEach(function (item) {
        var p = new Other(game,item,socket);
        hashmap.set(item,p);
    });
});

socket.on('update', function (data) {
    allPlayersData = [];
    data['players'].forEach(function (playerData) {
        if (playerData.id !== socketId) {
            allPlayersData.push(playerData);
        }
    });
});

socket.on('death', function (data) {
    if (data.id === socketId) {
        player.die(game);
    }
    hashmap.forEach(function (item) {
        item.checkID(data.id);
    });
});

socket.on('disconnected', function (data) {
    console.log('a player has left');
    hashmap.get(data.id).destroy();
    hashmap.remove(data.id);
});