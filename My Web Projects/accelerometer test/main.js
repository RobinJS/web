var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.scale.maxWidth = 770;
    game.scale.maxHeight = 1280;
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.scale.setScreenSize();

    // game.scale.compatibility.supportsFullScreen = true;
    game.scale.fullScreenTarget = game.canvas;
    // game.scale.compatibility.orientationFallback = 'viewport';
    game.scale.setupScale(770, 1280);

    game.load.spritesheet('bomb', 'img/bombImg.png', 90, 128);
    game.load.spritesheet('magnet', 'img/magnet.png', 90, 90);
    game.load.spritesheet('health', 'img/health.png', 24, 24);
    game.load.image('player', 'img/player.png');
    game.load.image('magnetHitAreaImg', 'img/magnetHitArea.png');
    game.load.image('speedUpIconImg', 'img/speed_up_icon.png');
    game.load.image('snail', 'img/snail.png');


    // game.scale.onOrientationChange.add(function(){
        
    // });

}

var player;
var bombs;
var move = false;
var step = 0;
var scoreText;
var livesText;
var str = "";
var score = 0;
var lives = 3;
var points;
var debug;
var magnetHitArea;
var magnets;
var speedUps;
var snails;
/*
    - Teleportation
        - bigger size
        - smaller size
        - speed up the falling things
        - speed down the falling things
    - happy face icon :)
        - explode all baddies around you (the bomb)
        - get all goodies around you (magnet)
    - shield
    - extra live
    - move in all directions
    - try to reach the bonus level
    - different goodies with different points
    - upgrade after each level

    si * 3 , do# * 2, re, la * 3 (down), (up) do# * 2, re, (down) sol * 3, (up) do# * 2, fa# * 2, mi * 2
*/

function create() {
    game.stage.setBackgroundColor("#dce2e6");
    debug = game.add.text(0, 50, " ", { font: "42px Verdana", fill: "#ffffff", align: "center" });
    //  The scrolling starfield background
    // starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  The hero!
    playerContainer = game.add.group();
    playerContainer.x = game.world.centerX;
    playerContainer.y = game.world.height - 10;
    playerContainer.enableBody = true;
    game.physics.enable(playerContainer, Phaser.Physics.ARCADE);
    // player.body.collideWorldBounds = true;
    
    player = game.add.sprite(0, 0, 'player');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    // player.body.collideWorldBounds = true;

    player.anchor.set(0.5, 1);
    player.body.immovable = true;
    playerContainer.addChild(player);

    magnetHitArea = game.add.sprite(0, 0, 'magnetHitAreaImg');
    game.physics.enable(magnetHitArea, Phaser.Physics.ARCADE);
    // magnetHitArea.body.collideWorldBounds = true;
    magnetHitArea.width = 400;
    magnetHitArea.height = 300;
    magnetHitArea.anchor.set(0.5, 1);
    magnetHitArea.body.immovable = true;
    
    playerContainer.addChild(magnetHitArea);

    //  The baddies!
    bombs = game.add.group();
    bombs.enableBody = true;
    bombs.physicsBodyType = Phaser.Physics.ARCADE;
    bombs.createMultiple(20, 'bomb');

    magnets = game.add.group();
    magnets.enableBody = true;
    magnets.physicsBodyType = Phaser.Physics.ARCADE;
    magnets.createMultiple(20, 'magnet');

    healths = game.add.group();
    healths.enableBody = true;
    healths.physicsBodyType = Phaser.Physics.ARCADE;
    healths.createMultiple(20, 'health');

    speedUps = game.add.group();
    speedUps.enableBody = true;
    speedUps.physicsBodyType = Phaser.Physics.ARCADE;
    speedUps.createMultiple(20, 'speedUpIconImg');

    snails = game.add.group();
    snails.enableBody = true;
    snails.physicsBodyType = Phaser.Physics.ARCADE;
    snails.createMultiple(20, 'snail');

    createEnemies();

    scoreText = game.add.text(0, 0, "Score: 0", { font: "42px Verdana", fill: "#ffffff", align: "center" });
    livesText = game.add.text(game.world.width - 180, 0, "Lives: 3", { font: "42px Verdana", fill: "#ffffff", align: "center" });

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

    creationTimer = game.time.create(false);
    creationTimer.loop(1000, createFallingObjects, this);
    creationTimer.start();

    cursors = game.input.keyboard.createCursorKeys();

}

function createFallingObjects () {
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


    var health = healths.getFirstDead(false);
    var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
    health.reset( x, -5);
    game.physics.arcade.moveToXY(health, x, game.world.height + 50, 60, 6000);

    health.type = 'health';
    health.outOfBoundsKill = true;
    health.checkWorldBounds = true;
}

function createEnemies () {

    // for (var y = 0; y < 4; y++)
    // {
        
    // }

    // enemies.x = 100;

    

    // var point = points.create(48, 50, 'point');
    // point.y = -250;
    // point.anchor.setTo(0.5, 0.5);
    // point.body.moves = false;
    // point.type = "point";
    // var tween2 = game.add.tween(point).to( { y: game.world.height + 50 }, 3000, Phaser.Easing.Linear.None, true, 0, 1000, false);
}

function update() {
    //  Scroll the background
    // starfield.tilePosition.y += 2;
    if ( move ) {
        var futurePosition = player.x + step;
        
        if ( futurePosition - player.width/2 <= 0 ) {
            playerContainer.x = 0;
        } else if ( futurePosition + playerContainer/2 >= game.world.width ) {
            playerContainer.x = game.world.width - playerContainer;
        } else {
            playerContainer.x += step;
        }
    }

    // if (player.alive) {
        //  Reset the player, then check for movement keys
        // player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown) {
            playerContainer.x -= 10;
        } else if (cursors.right.isDown) {
            playerContainer.x += 10;
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

        game.physics.arcade.collide(player, [bombs, magnets, healths], collisionHandler, null, this);
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

    return;
    game.debug.body(player);
    bombs.children.forEach(function(bomb){
        game.debug.body(bomb);
    });

    magnets.children.forEach(function(magnet){
        game.debug.body(magnet);
    });
}

function magnetisedCollection (obj1, obj2) {
    game.physics.arcade.moveToObject(obj2, playerContainer, 400);
}

function collisionHandler (obj1, obj2) {

    //  When a bullet hits an alien we kill them both
    // bullet.kill();
    obj2.kill();

    if ( obj2.type === 'enemy' ) {
        lives--;
    } else if ( obj2.type === 'health' ){

    } else {
        score++;
    }
    // //  Increase the score
    // score += 20;
    // scoreText.text = scoreString + score;

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

// function enemyHitsPlayer (player,bullet) {
    
//     bullet.kill();

//     live = lives.getFirstAlive();

//     if (live)
//     {
//         live.kill();
//     }

//     //  And create an explosion :)
//     var explosion = explosions.getFirstExists(false);
//     explosion.reset(player.body.x, player.body.y);
//     explosion.play('kaboom', 30, false, true);

//     // When the player dies
//     if (lives.countLiving() < 1)
//     {
//         player.kill();
//         enemyBullets.callAll('kill');

//         stateText.text=" GAME OVER \n Click to restart";
//         stateText.visible = true;

//         //the "click to restart" handler
//         game.input.onTap.addOnce(restart,this);
//     }
// }
