require([ "settings", "player" ],
    function( settings, Player ) {
        var game = new Phaser.Game(1280, 770, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
        
        var player, crystals, coins;
        var crystalsCollected = 0;
        var startButtonPressed = false;
        var startPageBg;
        var startButton;

        var gameBoundOffset = 130;
        var bombs;
        var moveX = false;
        var moveY = false;
        var stepX = 0;
        var stepY = 0;
        var scoreText;
        var livesText;
        var timerText;
        var str = "";
        var score = 0;
        var lives = 3;
        var timeRemaining;
        var points;
        var debug;
        var magnetHitArea;
        var magnets;
        var speedUps;
        var snails;
        var objectIndex = 0;
        var text;
        var lastStepX = 0;
        var lastStepY = 0;

        function preload() {
            game.scale.maxWidth = 1280;
            game.scale.maxHeight = 770;
            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            // game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.scale.setScreenSize();

            // game.scale.compatibility.supportsFullScreen = true;
            game.scale.fullScreenTarget = game.canvas;
            // game.scale.compatibility.orientationFallback = 'viewport';
            game.scale.setupScale(1280, 770);

            // game.load.spritesheet('startButton', 'img/button_sprite_sheet.png', 193, 71);

            // game.load.image('player_frame', 'img/player_frame.png');
            // game.load.image('player_glow', 'img/player_glow.png');
            // game.load.image('player_bg', 'img/player_bg.png');

            // // game.load.spritesheet('coin', 'img/coin_sprite.png', 143, 130, 10);
            // game.load.atlasJSONHash('coin', 'img/coin_sprite.png', 'img/coin_sprite.json');

            // game.load.image('crystal', 'img/crystal.png');
            // game.load.image('bomb', 'img/bombImg.png');
            // game.load.image('magnet', 'img/magnet.png');
            // game.load.image('health', 'img/health.png');
            // game.load.image('magnetHitAreaImg', 'img/magnetHitArea.png');
            // game.load.image('speedUpIconImg', 'img/speed_up_icon.png');
            // game.load.image('snail', 'img/snail.png');

            // game.load.image('bg_tiles', 'img/bg_tiles.jpg');
            game.load.spritesheet("bgImage", "img/bg.jpg", 3600, 770);


            // game.scale.onOrientationChange.add(function(){
                
            // });
        }

        
        /*
            - Teleportation
            - bigger size
            - smaller size
                - speed up the falling things
                - speed down the falling things
            - happy face icon :)
            - explode all baddies around you
                - get all around you (magnet)
            - extra live
            - move in all directions
            - try to reach the bonus level
            - different goodies with different points
            - upgrade after each level

            si * 3 , do# * 2, re, la * 3 (down), (up) do# * 2, re, (down) sol * 3, (up) do# * 2, fa# * 2, mi * 2
        */

        function create() {
            game.stage.setBackgroundColor("#000000"); // CHANGE to black !!!
            // debug = game.add.text(0, 50, " ", { font: "42px Verdana", fill: "#ffffff", align: "center" });
            game.world.setBounds(0, 0, 3600, 770);

            //  The scrolling starfield background
            backgroundImage = game.add.sprite(0, 0, 'bgImage');
            // game.physics.arcade.enable(backgroundImage);

            // backgroundImage.autoCull = true;
            // backgroundImage.checkWorldBounds = true;

            // backgroundImage.events.onOutOfBounds.add(function(){
            //     backgroundImage.x = game.world.bounds.right;
            // }, this);

            // createObjectGroups();

            // player = new Player( game );

            // scoreText = game.add.text(0, 0, "Score: 0", { font: "42px Verdana", fill: "#ffffff", align: "center" });
            // livesText = game.add.text(game.world.width - 180, 0, "Lives: 3", { font: "42px Verdana", fill: "#ffffff", align: "center" });
            // timerText = game.add.text(game.world.width / 2 - 50, 0, "1:00", { font: "42px Verdana", fill: "#ffffff", align: "center" });

            // var gameElements = {player: player, crystals: crystals, coins: coins};
            // window.DEBUG = {};
            // window.DEBUG.game = game;
            // window.DEBUG.gameElements = gameElements;
            text = game.add.text(50, 0, "", { font: "42px Verdana", fill: "#000000", align: "center" });
            text.fixedToCamera = true;
            cursors = game.input.keyboard.createCursorKeys();
            onStartButtonPressed();
            // showStartScreen();
        }

        function update() {
            text.text = "" + stepX;
            // if ( !startButtonPressed ) {
            //     return;
            // }

            //  Scroll the background
            // backgroundImage.tilePosition.y += settings.bgSpeed;

            if ( moveX ) {
                var futurePosition = game.camera.x + stepX;
                game.camera.x = stepX * 10;
                // if ( futurePosition - player.width/2 <= 0 ) {
                //     game.camera.x = 0;
                // } else if ( futurePosition + player/2 >= game.world.width ) {
                //     game.camera.x -= stepX;
                // } else {
                //     game.camera.x += stepX;
                // }
            }

            if ( moveY ) {
                var futurePosition = game.camera.y + stepY;
                // game.camera.y = stepY;
                // if ( futurePosition - player.width/2 <= 0 ) {
                //     game.camera.y = 0;
                // } else if ( futurePosition + player/2 >= game.world.width ) {
                //     game.camera.x -= stepX;
                // } else {
                //     game.camera.x += stepX;
                // }
            }

            // if (player.alive) {
                //  Reset the player, then check for movement keys
                // player.body.velocity.setTo(0, 0);

                if (cursors.left.isDown) {
                    game.camera.x -= 10;
                } else if (cursors.right.isDown) {
                    game.camera.x += 10;
                }

                // //  Firing?
                // if (fireButton.isDown)
                // {
                //     fireBullet();
                // }

                // if (game.time.now > firingTimer)
                // {
                //     enemyFires();
                // }

                //  Run collision
                // game.physics.arcade.overlap(player.container.children[1], [crystals, coins], collisionHandler, null, this);
            // }

            // healths.forEach(function(h){
            //     if ( h.y > game.world.height - 150 ) {
            //         game.physics.arcade.moveToObject(h, player, 400);
            //     }
            // });

            // text.text = player.x;
            // scoreText.text = "Score: " + score;
            // livesText.text = "Lives: " + lives;

            // game.add.text(0, 50, game.scale.isFullScreen + " " + game.scale.isGamePortrait, { font: "42px Verdana", fill: "#ffffff", align: "center" })
        }

        function render() {

            // for (var i = 0; i < aliens.length; i++)
            // {
            //     game.debug.body(aliens.children[i]);
            // }

            // debug.text = "speed: " + speed;

            
            // game.debug.body(magnetHitArea);
            // game.debug.body(player.container.children[3]);

            return;
            crystals.children.forEach(function(cr){
                game.debug.body(cr);
            });

            magnets.children.forEach(function(magnet){
                game.debug.body(magnet);
            });
        }

        function showStartScreen () {
            startPageBg = game.add.graphics(0, 0);
            startPageBg.beginFill(0x000000, 1);
            startPageBg.drawRect(0, 0, game.world.width, game.world.height);

            startButton = game.add.button(game.world.centerX - 95, 400, 'startButton', onStartButtonPressed, this, 2, 1, 0);
        }

        function hideStartScreen(){
            startPageBg.visible = false;
            startButton.visible = false;
        }

        function onStartButtonPressed(){
            // hideStartScreen();
            // startButtonPressed = true;

            if (window.DeviceMotionEvent != undefined) {
                window.addEventListener('deviceorientation', function(e) {
                    if ( e.alpha && Math.abs(e.alpha.toFixed(0)) != '0' && Math.abs(e.alpha.toFixed(0)) != '-0' ) {
                        stepX = parseInt(e.alpha.toFixed(0));
                        // if ( stepX > lastStepX ) {
                        //     stepX = 10
                        // } else if ( stepX < lastStepX ){
                        //     stepX = -10
                        // }

                        // lastStepX = stepX;
                        moveX = true;
                        // speed = step;
                    } else {
                        moveX = false;
                    }

                    if ( e.beta && Math.abs(e.beta.toFixed(0)) != '0' && Math.abs(e.beta.toFixed(0)) != '-0' ) {
                        stepY = parseInt(e.beta.toFixed(0));

                        // if ( stepY > lastStepY ) {
                        //     stepY = 10
                        // } else if ( stepY < lastStepY ){
                        //     stepY = -10
                        // }

                        // lastStepY = stepY;

                        moveY = true;
                        // speed = step;
                    } else {
                        moveY = false;
                    }

                    // if ( e.accelerationIncludingGravity.x && Math.abs(e.accelerationIncludingGravity.x.toFixed(0)) != 0 ) {
                    // // if ( e.rotationRate.beta && e.rotationRate.beta.toFixed(0) != 0 ) {
                    //     step = e.accelerationIncludingGravity.x.toFixed(1);
                    //     // step = e.rotationRate.beta.toFixed(0) / 10;
                    //     speed = step;
                    //     move = true;
                    // } else {
                    //     move = false;
                    // }
                });

            }

            // cursors = game.input.keyboard.createCursorKeys();

            // startLevel();
        }

        function timerUpdate () {
            createFallingObjects();

            timeRemaining--;

            if ( timeRemaining === 0 ) {
                // end level
            } else if ( timeRemaining < 10 ) {
                timerText.text = "0:0" + timeRemaining;
            } else {
                timerText.text = "0:" + timeRemaining;
            }
        }

        function startLevel () {
            timeRemaining = 60;
            creationTimer = game.time.create(false);
            creationTimer.loop(1000, timerUpdate, this);
            creationTimer.start();
        }

        function magnetisedCollection (obj1, obj2) {
            game.physics.arcade.moveToObject(obj2, playerContainer, 400);
        }

        function crystalCatchHandler (obj1, obj2){
            obj2.kill();
        }

        function collisionHandler (playerCollisionObj, collisionObj) {
            //  When a bullet hits an alien we kill them both
            // bullet.kill();
            collisionObj.kill();

            if ( collisionObj.type === 'crystal' ) {
                crystalsCollected++;
                player.expandBg();
            } else if ( collisionObj.type === 'coin' ){
                score += 10;
                scoreText.text = settings.scoreString + score;
                
            }
                
            // //  And create an explosion :)
            // var explosion = explosions.getFirstExists(false);
            // explosion.reset(alien.body.x, alien.body.y);
            // explosion.play('kaboom', 30, false, true);

            // if (aliens.countLiving() == 0)
            // {
            //     score += 1000;
            //     scoreText.text = scoreString + score;

            //     enemyBullets.callAll('kill',this);
            //     stateText.text = " You Won, \n Click to restart";
            //     stateText.visible = true;

            //     //the "click to restart" handler
            //     game.input.onTap.addOnce(restart,this);
            // }
        }

        function createObjectGroups () {

            crystals = game.add.group();
            crystals.enableBody = true;
            crystals.physicsBodyType = Phaser.Physics.ARCADE;
            crystals.createMultiple(20, 'crystal');

            coins = game.add.group();
            coins.enableBody = true;
            coins.physicsBodyType = Phaser.Physics.ARCADE;
            coins.createMultiple(20, 'coin');

            // bombs = game.add.group();
            // bombs.enableBody = true;
            // bombs.physicsBodyType = Phaser.Physics.ARCADE;
            // bombs.createMultiple(20, 'bomb');

            // magnets = game.add.group();
            // magnets.enableBody = true;
            // magnets.physicsBodyType = Phaser.Physics.ARCADE;
            // magnets.createMultiple(20, 'magnet');

            // healths = game.add.group();
            // healths.enableBody = true;
            // healths.physicsBodyType = Phaser.Physics.ARCADE;
            // healths.createMultiple(20, 'health');

            // speedUps = game.add.group();
            // speedUps.enableBody = true;
            // speedUps.physicsBodyType = Phaser.Physics.ARCADE;
            // speedUps.createMultiple(20, 'speedUpIconImg');

            // snails = game.add.group();
            // snails.enableBody = true;
            // snails.physicsBodyType = Phaser.Physics.ARCADE;
            // snails.createMultiple(20, 'snail');
        }

        function setProps( obj, scale, bodyWidth, bodyHeight, type ){
            obj.scale.x = scale;
            obj.scale.y = scale;

            obj.body.width = bodyWidth;
            obj.body.height = bodyHeight;

            obj.anchor.x = 0.5;
            obj.anchor.y = 0.5;

            obj.outOfBoundsKill = true;
            obj.checkWorldBounds = true;
            obj.type = type;
        }

        function randInRangeWithStep( min, max, step ){
            var tempArr = [];

            for (var i = 0; i < max/step; i++) {
                tempArr.push( i * step );
            }

            var randIndex = game.rnd.between(0, tempArr.length);
            return tempArr[randIndex];
        }

        function createFallingObjects () {
            var rand = game.rnd.between(0, 10), objectToCreate;

            if ( rand === 0 ) {
                objectToCreate = crystals.getFirstDead(false);
                var x = randInRangeWithStep(0, game.world.width - gameBoundOffset, 100) + 50;
                objectToCreate.reset( x, -5);
                setProps( objectToCreate, 1, 50, 64, 'crystal' );
                game.physics.arcade.moveToXY(objectToCreate, objectToCreate.x, game.world.height + gameBoundOffset, 60, 6000);
                
            }

            if ( rand % 3 === 0 ) {
                objectToCreate = coins.getFirstDead(false);
                var x = randInRangeWithStep(0, game.world.width - gameBoundOffset, 100) + 50;
                objectToCreate.reset( x, -5);
                setProps( objectToCreate, 1, 50, 45, 'coin' );
                objectToCreate.animations.add('flip');
                objectToCreate.animations.play('flip', 20, true);
                game.physics.arcade.moveToXY(objectToCreate, objectToCreate.x, game.world.height + gameBoundOffset, 60, 6000);
            }
            

            // var bomb = bombs.getFirstDead(false);
            // bomb.scale.x = 0.5;
            // bomb.scale.y = 0.5;
            // var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
            // bomb.reset( x, -5);
            // game.physics.arcade.moveToXY(bomb, x, game.world.height + 50, 60, 6000);
            // bomb.type = 'bomb';
            // bomb.body.width = 45;
            // bomb.body.height = 70;

            // bomb.anchor.x = 0.5;
            // bomb.anchor.y = 0.5;

            // bomb.outOfBoundsKill = true;
            // bomb.checkWorldBounds = true;


            // var magnet = magnets.getFirstDead(false);
            // magnet.scale.x = 0.5;
            // magnet.scale.y = 0.5;
            // var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
            // magnet.reset( x, -5);
            // game.physics.arcade.moveToXY(magnet, x, game.world.height + 50, 60, 6000);
            // magnet.type = 'magnet';
            // magnet.body.width = 45;
            // magnet.body.height = 70;

            // magnet.anchor.x = 0.5;
            // magnet.anchor.y = 0.5;

            // magnet.outOfBoundsKill = true;
            // magnet.checkWorldBounds = true;


            // var speedUp = speedUps.getFirstDead(false);
            // speedUp.scale.x = 0.5;
            // speedUp.scale.y = 0.5;
            // var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
            // speedUp.reset( x, -5);
            // game.physics.arcade.moveToXY(speedUp, x, game.world.height + 50, 60, 6000);
            // speedUp.type = 'speedUp';
            // speedUp.body.width = 45;
            // speedUp.body.height = 70;

            // speedUp.anchor.x = 0.5;
            // speedUp.anchor.y = 0.5;

            // speedUp.outOfBoundsKill = true;
            // speedUp.checkWorldBounds = true;

            // var snail = snails.getFirstDead(false);
            // snail.scale.x = 0.5;
            // snail.scale.y = 0.5;
            // var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
            // snail.reset( x, -5);
            // game.physics.arcade.moveToXY(snail, x, game.world.height + 50, 60, 6000);
            // snail.type = 'snail';
            // snail.body.width = 45;
            // snail.body.height = 70;

            // snail.anchor.x = 0.5;
            // snail.anchor.y = 0.5;

            // snail.outOfBoundsKill = true;
            // snail.checkWorldBounds = true;


            // var health = healths.getFirstDead(false);
            // var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
            // health.reset( x, -5);
            // game.physics.arcade.moveToXY(health, x, game.world.height + 50, 60, 6000);

            // health.type = 'health';
            // health.outOfBoundsKill = true;
            // health.checkWorldBounds = true;
        }

});