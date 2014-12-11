require(["stage", "config", "gameManager" ],
	function( stage, config, gameManager ) {

	var gameManager = new gameManager();

	return;

	var grid = 50,
		x = 0,
		y = 0,
		battleFieldLeftOffset = 50,
		strikeFieldLeftOffset = 650,
		strikeFieldTopOffset = 250,
		fieldWidth = 500,
		fieldHeight = 500;


	$('#mainCanvas').css('background-position', strikeFieldLeftOffset + 'px ' + strikeFieldTopOffset + 'px');

	var marker = new createjs.Shape();
	marker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(strikeFieldLeftOffset, strikeFieldTopOffset, 50, 50);
	marker.visible = false;
	
	var strikeFieldHitArea = new createjs.Shape();
	strikeFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(strikeFieldLeftOffset, strikeFieldTopOffset, fieldWidth, fieldHeight);

	mainStage.addChild(strikeFieldHitArea);
	mainStage.addChild(marker);

	mainStage.on('stagemousemove', function(e) {
		if ( (e.stageX <= strikeFieldLeftOffset || e.stageY <= strikeFieldTopOffset) || (e.stageX >= strikeFieldLeftOffset + fieldWidth || e.stageY >= strikeFieldTopOffset + fieldHeight ) ) return;

		marker.x = Math.floor( ( e.stageX / grid) ) * grid - strikeFieldLeftOffset;
		marker.y = Math.floor( ( e.stageY / grid) ) * grid - strikeFieldTopOffset;
	});

	strikeFieldHitArea.on('mouseover', function(e){
		marker.visible = true;
	});

	strikeFieldHitArea.on('mouseout', function(){
		marker.visible = false;
	});

	// $('#mainCanvas').css('-webkit-transform', 'scale(0.5)');

});