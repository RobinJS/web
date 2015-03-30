var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.scale.maxWidth = 770;
    game.scale.maxHeight = 1280;
    game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.scale.setScreenSize();

    game.load.spritesheet('enemy', 'img/enemy.png', 24, 24);
    game.load.spritesheet('health', 'img/health.png', 24, 24);
    game.load.image('player', 'img/player.png');



}

var player;
var enemies;
var move = false;
var step = 0;
var scoreText;
var livesText;
var str = "";
var score = 0;
var lives = 3;
var points;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    // starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    // bullets = game.add.group();
    // bullets.enableBody = true;
    // bullets.physicsBodyType = Phaser.Physics.ARCADE;
    // bullets.createMultiple(30, 'bullet');
    // bullets.setAll('anchor.x', 0.5);
    // bullets.setAll('anchor.y', 1);
    // bullets.setAll('outOfBoundsKill', true);
    // bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    // enemyBullets = game.add.group();
    // enemyBullets.enableBody = true;
    // enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    // enemyBullets.createMultiple(30, 'enemyBullet');
    // enemyBullets.setAll('anchor.x', 0.5);
    // enemyBullets.setAll('anchor.y', 1);
    // enemyBullets.setAll('outOfBoundsKill', true);
    // enemyBullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(game.world.centerX, game.world.height - 60, 'player');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    enemies.createMultiple(20, 'enemy');

    enemies.setAll('anchor.x', 0.5);
    enemies.setAll('anchor.y', 0.5);
    enemies.setAll('outOfBoundsKill', true);
    enemies.setAll('checkWorldBounds', true);

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
         window.ondevicemotion = function(e) {
            if ( e.accelerationIncludingGravity.x && e.accelerationIncludingGravity.x.toFixed(0) != 0 ) {
            // if ( e.rotationRate.beta && e.rotationRate.beta.toFixed(0) != 0 ) {
                step = e.accelerationIncludingGravity.x.toFixed(0);
                // step = e.rotationRate.beta.toFixed(0) / 10;
                move = true;
            } else {
                move = false;
            }

            if ( e.acceleration.x ) {
                // str += "acc.x: " + acceleration.x + " ";
            }
            // str = e.acceleration.x.toFixed(2).toString().split(".")[1].substring(1,0);

            if ( e.accelerationIncludingGravity.x ) {
                // str += "acc+g.x: " + accelerationIncludingGravity.x;
            }

            // str = e.accelerationIncludingGravity.x.toFixed(0);
            // str = e.rotationRate.beta.toFixed(0);


         }
    }


    setInterval(function(){
        // var enemy = enemies.create(Math.floor(Math.random() * game.world.width ), -50, 'enemy');
        var enemy = enemies.getFirstDead(false);
        var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
        enemy.reset( x, -5);
        enemy.rotation = game.physics.arcade.moveToXY(enemy, x, game.world.height + 50, 60, 3000);
        enemy.type = 'enemy';

        var health = healths.getFirstDead(false);
        var x = Math.floor(Math.random() * game.world.width - 24 ) + 12;
        health.reset( x, -5);
        health.rotation = game.physics.arcade.moveToXY(health, x, game.world.height + 50, 60, 3000);
        health.type = 'health';
    }, 1000);

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

// function setupInvader (invader) {

//     invader.anchor.x = 0.5;
//     invader.anchor.y = 0.5;
//     invader.animations.add('kaboom');
// }

// function descend() {

//     aliens.y += 10;
// }

function update() {
    //  Scroll the background
    // starfield.tilePosition.y += 2;
    if ( move ) {
        var futurePosition = player.x + step * 3;
        if ( futurePosition > player.width / 2 && futurePosition < game.world.width - player.width / 2 ) {
            player.x += step * 3;
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
        game.physics.arcade.overlap(player, enemies, collisionHandler, null, this);
        game.physics.arcade.overlap(player, healths, collisionHandler, null, this);
        // game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    // }

    // text.text = player.x;
    scoreText.text = "Score: " + score;
    livesText.text = "Lives: " + lives;
}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }
}

function collisionHandler2 (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    // bullet.kill();
    alien.kill();

    score++;
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

// function enemyFires () {

//     //  Grab the first bullet we can from the pool
//     enemyBullet = enemyBullets.getFirstExists(false);

//     livingEnemies.length=0;

//     aliens.forEachAlive(function(alien){

//         // put every living enemy in an array
//         livingEnemies.push(alien);
//     });


//     if (enemyBullet && livingEnemies.length > 0)
//     {
        
//         var random=game.rnd.integerInRange(0,livingEnemies.length-1);

//         // randomly select one of them
//         var shooter=livingEnemies[random];
//         // And fire the bullet from this enemy
//         enemyBullet.reset(shooter.body.x, shooter.body.y);

//         game.physics.arcade.moveToObject(enemyBullet,player,120);
//         firingTimer = game.time.now + 2000;
//     }
// }

// function fireBullet () {

//     //  To avoid them being allowed to fire too fast we set a time limit
//     if (game.time.now > bulletTime)
//     {
//         //  Grab the first bullet we can from the pool
//         bullet = bullets.getFirstExists(false);

//         if (bullet)
//         {
//             //  And fire it
//             bullet.reset(player.x, player.y + 8);
//             bullet.body.velocity.y = -400;
//             bulletTime = game.time.now + 200;
//         }
//     }
// }

// function resetBullet (bullet) {

//     //  Called if the bullet goes out of the screen
//     bullet.kill();
// }

// function restart () {

//     //  A new level starts
    
//     //resets the life count
//     lives.callAll('revive');
//     //  And brings the aliens back from the dead :)
//     aliens.removeAll();
//     createAliens();

//     //revives the player
//     player.revive();
//     //hides the text
//     stateText.visible = false;
// }