require(["stage", "config" ],
	function( stage, config ) {

	var grid = 50,
		x = 0,
		y = 0,
		battleFieldLeftOffset = 50,
		strikeFieldLeftOffset = 650,
		strikeFieldTopOffset = 250,
		fieldWidth = 500,
		fieldHeight = 500;


	$('#mainCanvas').css('background-position', strikeFieldLeftOffset + 'px ' + strikeFieldTopOffset + 'px');

	var battleFieldBg = new createjs.Bitmap("img/grid.png"),
		fieldNumbers = [ new createjs.Bitmap("img/field_numbers.png"), new createjs.Bitmap("img/field_numbers.png") ];
		fieldLetters = [ new createjs.Bitmap("img/field_letters.png"), new createjs.Bitmap("img/field_letters.png") ];

	fieldNumbers[0].x = 50;
	fieldNumbers[0].y = 200;
	fieldNumbers[1].x = 650;
	fieldNumbers[1].y = 200;
	fieldLetters[0].x = 0;
	fieldLetters[0].y = 250;
	fieldLetters[1].x = 600;
	fieldLetters[1].y = 250;

	mainStage.addChild(fieldNumbers[0]);
	mainStage.addChild(fieldNumbers[1]);
	mainStage.addChild(fieldLetters[0]);
	mainStage.addChild(fieldLetters[1]);

	var battleField = new createjs.Container();
	battleField.addChild(battleFieldBg);
	battleField.x = battleFieldLeftOffset;
	battleField.y = strikeFieldTopOffset;

	mainStage.addChild(battleField);

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