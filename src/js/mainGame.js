/**
* canvas creation
*/
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 240;
document.body.appendChild(canvas);
/**
* Audio Setup
*/
gameAudio = new Audio("audio/gameSong.wav");
gameAudio.loop = true;
gameAudio.play();
/**
* Main variables
*/
var beg = false;
/**
* setup screen
*/
var bgIndex = new Array();
var image1 = "images/mainScreen.png";
var image2 = "images/instructions.png";
var image3 = "images/level.png";
bgIndex.push(image1);
bgIndex.push(image2);
bgIndex.push(image3);
var bgReady = false;
var bgValue = 0;
var bgImage = new Image();
var bgObj = {
	x : 0,
	y : 0
};
bgImage.onload = function(){
	bgReady = true;
};
bgImage.src = bgIndex[0];
/**
* player image
*/
var playReady = false;
var playImage = new Image();
playImage.onload = function(){
	playReady = true;
};
playImage.src = "images/player.png";
var player = {
	x : 0,
	y : 0,
	progress : 0,
	money : 0,	
	hunger : 5,		
	confidence : 0	
};
/**
* other image
*/
var otReady = false;
var otImage = new Image();
otImage.onload = function(){
	otReady = true;
};
otImage.src = "images/other.png";
var other = {

	x : 0,
	y : 0,
	speed : 256

};
/**
* keydown functionality
*/
var keysDown = {};
addEventListener("keydown", function(e){
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function(e){

	switch(bgValue){
		case 0:
			switch(e.keyCode){
				case 88:
					bgValue = 1;
					break;
				case 90:
					bgValue = 2;
					break;
			}
			break;
		case 1:
			switch(e.keyCode){
				case 88:
					bgValue = 0;
					break;
			}
			break;
		case 2:
			if(beg){
				if(e.keyCode == 90){
					other.x -= 5;
				}
			}
			break;
		default:
			break;
	}
	delete keysDown[e.keyCode];

}, false);
/*******
* mainGame.js -> main game functionality
*******/
var gameInit = function(){

	bgImage.src = bgIndex[0];

	bgObj.x = 0;
	bgObj.y = 0;

	player.x = 0;
	player.y = 0;

	other.x = 0;
	other.y = 0;

}
/**
* player action/logic
*/
var update = function(aTiming){

	bgImage.src = bgIndex[bgValue];
	switch(bgValue){
		case 2:
			otherThink();
			break;
	}
}
/**
* player input detection
*/
var playerInput = function(modifier){
	if(bgValue == 2){
		if(37 in keysDown){
			if((bgObj.x < 0) && (player.x == canvas.width/2 - playImage.width/2)){
				bgObj.x += 0.5; // left
				other.x -= 0.5;
			}else{
				if(player.x > 0){
					player.x -= 0.5;
				}
			}
		}
		if(39 in keysDown){
			if((bgObj.x > -(bgImage.width) + (canvas.width)) && (player.x == canvas.width/2 - playImage.width/2)){
				bgObj.x -= 0.5; // right
				other.x -= 1.5;
			}else{
				if(player.x + playImage.width < canvas.width){
					player.x += 0.5;
				}
			}
		}
	}

}

var render = function(){
	
	if(bgReady){
		ctx.drawImage(bgImage, bgObj.x , bgObj.y);
	}
	if(bgValue == 2){
		if(playReady){
			ctx.drawImage(playImage, player.x , canvas.height - 90);
		}
		if(otReady){
			ctx.drawImage(otImage, other.x , canvas.height - 90);
		}
		if(beg){
			ctx.fillStyle = "rgb(250, 250, 250)";
			ctx.font = "24px Helvetica";
			ctx.textAlign = "center";
			//ctx.textBaseline = "bottom";
			ctx.fillText("Press Z for Help",canvas.width/2, canvas.height - 20);
		}
	}
}

var main = function(){

	var now = Date.now();
	var delta = now - lastFrame;

	update(delta / 1000);
	playerInput(delta / 1000);
	render();

	lastFrame = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);

}

var otherThink = function(){
	if(other.x > bgObj.x + otImage.width){
		other.x -= 1.5;
	}else{
		other.x = bgObj.x + bgImage.width;
	}

	if(boxCollision(other, otImage, player, playImage)){
		beg = true;
	}else{
		beg = false;
	}
}

var boxCollision = function(obj1, img1, obj2, img2){

	var p1x = obj1.x;
	var p1w = obj1.x + img1.width;
	var p2x = obj2.x;
	var p2w = obj2.x + img2.width;

	if((p1x > p2x && p1x < p2w) || (p2x > p1x && p2x < p1w)){
		return true;
	}else{
		return false;
	}

}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var lastFrame = Date.now();	//
gameInit();					//
main(); 					