requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'libs/jquery',
        easeljs: 'libs/easeljs',
        TweenMax: 'libs/TweenMax',
        signals: 'libs/signals'
    }
});

require([ 'jquery', 'easeljs', 'TweenMax', 'signals', "gameManager" ],
	function( $, createjs, TweenMax, signals, gameManager ) {

	// var gameManager = new gameManager();
	window.gameManager = new gameManager();
});