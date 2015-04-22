require([ "settings", "player" ],
    function( settings, Player ) {
        var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
        
        var player, crystals, coins;
        var crystalsCollected = 0;
        var startButtonPressed = false;
        var startPageBg;
        var startButton;

        var gameBoundOffset = 130;
        var bombs;
        var move = false;
        var step = 0;
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

        function preload() {
            game.scale.maxWidth = 720;
            game.scale.maxHeight = 1280;
            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            // game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.scale.setScreenSize();

            // game.scale.compatibility.supportsFullScreen = true;
            game.scale.fullScreenTarget = game.canvas;
            // game.scale.compatibility.orientationFallback = 'viewport';
            game.scale.setupScale(720, 1280);

            game.load.spritesheet('startButton', 'img/button_sprite_sheet.png', 193, 71);

            game.load.image('player_frame', 'img/player_frame.png');
            game.load.image('player_glow', 'img/player_glow.png');
            game.load.image('player_bg', 'img/player_bg.png');

            // game.load.spritesheet('coin', 'img/coin_sprite.png', 143, 130, 10);
            game.load.atlasJSONHash('coin', 'img/coin_sprite.png', 'img/coin_sprite.json');

            game.load.image('crystal', 'img/crystal.png');
            game.load.image('bomb', 'img/bombImg.png');
            game.load.image('magnet', 'img/magnet.png');
            game.load.image('health', 'img/health.png');
            game.load.image('magnetHitAreaImg', 'img/magnetHitArea.png');
            game.load.image('speedUpIconImg', 'img/speed_up_icon.png');
            game.load.image('snail', 'img/snail.png');

            // game.load.image('bg_tiles', 'img/bg_tiles.jpg');
            game.load.spritesheet("bgImage", "img/bg.png", 720, 1280);


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
            // game.stage.setBackgroundColor("#dce2e6"); // CHANGE to black !!!
            game.stage.setBackgroundColor("#000000"); // CHANGE to black !!!
            debug = game.add.text(0, 50, " ", { font: "42px Verdana", fill: "#ffffff", align: "center" });
            //  The scrolling starfield background
            backgroundImage = game.add.tileSprite(0, 0, 720, 1280, 'bgImage');

            // var skyLayer = game.add.group();
            // skyLayer.z = 0;
            // var cloudLayer = game.add.group();
            // cloudLayer.z = 1;

            createObjectGroups();
            player = new Player( game );

            scoreText = game.add.text(0, 0, "Score: 0", { font: "42px Verdana", fill: "#ffffff", align: "center" });
            livesText = game.add.text(game.world.width - 180, 0, "Lives: 3", { font: "42px Verdana", fill: "#ffffff", align: "center" });
            timerText = game.add.text(game.world.width / 2 - 50, 0, "1:00", { font: "42px Verdana", fill: "#ffffff", align: "center" });

            var gameElements = {player: player, crystals: crystals, coins: coins};
            window.DEBUG = {};
            window.DEBUG.game = game;
            window.DEBUG.gameElements = gameElements;


            showStartScreen();
        }

        function update() {
            if ( !startButtonPressed ) {
                return;
            }

            //  Scroll the background
            backgroundImage.tilePosition.y += settings.bgSpeed;

            if ( move ) {
                var futurePosition = player.container.x + step;
                
                if ( futurePosition - player.width/2 <= 0 ) {
                    player.container.x = 0;
                } else if ( futurePosition + player/2 >= game.world.width ) {
                    player.container.x = game.world.width - player;
                } else {
                    player.container.x += step;
                }
            }

            // if (player.alive) {
                //  Reset the player, then check for movement keys
                // player.body.velocity.setTo(0, 0);

                if (cursors.left.isDown) {
                    player.container.x -= 10;
                } else if (cursors.right.isDown) {
                    player.container.x += 10;
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
                // game.physics.arcade.overlap(player, bombs, collisionHandler, null, this);
                // game.physics.arcade.overlap(player, healths, collisionHandler, null, this);
                // game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

                // game.physics.arcade.overlap(player.children[0], [bombs], collisionHandler, null, this);
                game.physics.arcade.overlap(player.container.children[1], [crystals, coins], collisionHandler, null, this);
                // game.physics.arcade.overlap(magnetHitArea, healths, magnetisedCollection, null, this);
            // }

            // healths.forEach(function(h){
            //     if ( h.y > game.world.height - 150 ) {
            //         game.physics.arcade.moveToObject(h, player, 400);
            //     }
            // });

            // text.text = player.x;
            scoreText.text = "Score: " + score;
            livesText.text = "Lives: " + lives;

            // game.add.text(0, 50, game.scale.isFullScreen + " " + game.scale.isGamePortrait, { font: "42px Verdana", fill: "#ffffff", align: "center" })
        }

        function render() {

            // for (var i = 0; i < aliens.length; i++)
            // {
            //     game.debug.body(aliens.children[i]);
            // }

            // debug.text = "speed: " + speed;
            debug.text = "step: " + step;
            
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
            hideStartScreen();
            startButtonPressed = true;

            if (window.DeviceMotionEvent != undefined) {
                window.addEventListener('deviceorientation', function(e) {
                    if ( e.gamma && Math.abs(e.gamma.toFixed(0)) != '0' && Math.abs(e.gamma.toFixed(0)) != '-0' ) {
                        step = parseInt(e.gamma.toFixed(0));
                        move = true;
                        // speed = step;
                    } else {
                        move = false;
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

            cursors = game.input.keyboard.createCursorKeys();

            startLevel();
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

        function getRandomXPos(){
            return Math.floor(Math.random() * game.world.width - gameBoundOffset );
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

        function createFallingObjects () {
            var crystal = crystals.getFirstDead(false);
            crystal.reset( getRandomXPos(), -5);
            setProps( crystal, 1, 50, 64, 'crystal' );
            game.physics.arcade.moveToXY(crystal, crystal.x, game.world.height + gameBoundOffset, 60, 6000);

            var coin = coins.getFirstDead(false);
            coin.reset( getRandomXPos(), -5);
            setProps( coin, 1, 50, 45, 'coin' );
            coin.animations.add('flip');
            coin.animations.play('flip', 20, true);
            game.physics.arcade.moveToXY(coin, coin.x, game.world.height + gameBoundOffset, 60, 6000);

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