function MapLoader() {

}

MapLoader.prototype = {
    loadMap: function (mapName) {
        var state = game.state.getCurrentState();
        state.map = game.add.tilemap(mapName);
        state.map.addTilesetImage("tiles");

        state.map.setCollisionBetween(0, 2);

        state.mapLayer = state.map.createLayer("Tile Layer 1");
        state.mapLayer.resizeWorld();

        // Load objects
        console.log(state.map.objects);

        var objectLayer = state.map.objects["Object Layer 1"];

        console.log(objectLayer);

        for (var i = 0; i < objectLayer.length; i++) {
            var gameObject = objectLayer[i];
            console.log(gameObject);

            var objectX = gameObject.x - (gameObject.x % 32);
            var objectY = gameObject.y - (gameObject.y % 32);

            switch (gameObject.type) {
                case "kello":
                    var clock = game.make.sprite(objectX, objectY, "kello");
                    
                    clock.animations.add("idle", [0,1,2,3,4,5], 8, true);
                    clock.animations.add("idle", [0, 1, 2, 3, 4, 5], 8, true);
                    clock.animations.play("idle");

                    state.levelObstacles.add(clock);

                    clock.body.allowGravity = false;
                    clock.body.immovable = true;

                    clock.body.checkCollision = {
                        up: true,
                        left: false,
                        right: false,
                        down: false
                    };

                    console.log("Clock created at " + objectX + "x" + objectY);
                    break;
                    
                case "hella":
                    var hella = game.make.sprite(objectX, objectY, "hella");

                    state.levelObstacles.add(hella);

                    hella.body.allowGravity = false;
                    hella.body.immovable = true;

                    hella.body.checkCollision = {
                        up: true,
                        left: false,
                        right: false,
                        down: false
                    };
                    break;
            }
        }
    }
};