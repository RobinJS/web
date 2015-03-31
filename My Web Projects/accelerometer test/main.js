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

    game.load.spritesheet('bomb', 'img/bombImg.png', 200, 200);
    game.load.spritesheet('health', 'img/health.png', 24, 24);
    game.load.image('player', 'img/player.png');

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
/*
    - Teleportation
    - bigger size
    - smaller size
    - speed up the falling things
    - speed down the falling things
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
    debug = game.add.text(0, 50, " ", { font: "42px Verdana", fill: "#ffffff", align: "center" });
    //  The scrolling starfield background
    // starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  The hero!
    player = game.add.sprite(game.world.centerX, game.world.height - 60, 'player');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.anchor.set(0.5);
    

    //  The baddies!
    bombs = game.add.group();
    bombs.enableBody = true;
    bombs.physicsBodyType = Phaser.Physics.ARCADE;
    bombs.createMultiple(20, 'bomb');

    bombs.setAll('anchor.x', 0.5);
    bombs.setAll('anchor.y', 0.5);
    bombs.setAll('outOfBoundsKill', true);
    bombs.setAll('checkWorldBounds', true);

    healths = game.add.group();
    healths.enableBody = true;
    healths.physicsBodyType = Phaser.Physics.ARCADE;
    healths.createMultiple(20, 'health');

    healths.setAll('anchor.x', 0.5);
    healths.setAll('anchor.y', 0.5);
    healths.setAll('outOfBoundsKill', true);
    healths.setAll('checkWorldBounds', true);

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

}

function createFallingObjects () {
    var bomb = bombs.getFirstDead(false);
    bomb.scale.x = 0.5;
    bomb.scale.y = 0.5;
    var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
    bomb.reset( x, -5);
    game.physics.arcade.moveToXY(bomb, x, game.world.height + 50, 60, 3000);
    bomb.type = 'bomb';

    var health = healths.getFirstDead(false);
    var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
    health.reset( x, -5);
    health.rotation = game.physics.arcade.moveToXY(health, x, game.world.height + 50, 60, 3000);
    health.type = 'health';
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
            player.body.x = 0;
        } else if ( futurePosition + player.width/2 >= game.world.width ) {
            player.body.x = game.world.width - player.width;
        } else {
            player.body.x += step;
        }
    }

    // if (player.alive) {
        //  Reset the player, then check for movement keys
        // player.body.velocity.setTo(0, 0);

        // if (cursors.left.isDown)
        // {
        //     player.body.velocity.x = -200;
        // }
        // else if (cursors.right.isDown)
        // {
        //     player.body.velocity.x = 200;
        // }

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
        game.physics.arcade.overlap(player, bombs, collisionHandler, null, this);
        game.physics.arcade.overlap(player, healths, collisionHandler, null, this);
        // game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    // }

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
}



function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    // bullet.kill();
    alien.kill();

    if ( alien.type === 'enemy' ) {
        lives--;
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
