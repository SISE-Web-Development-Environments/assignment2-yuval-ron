var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var remainingTime;
var interval;
var ghostsInterval;
var timeInterval;
var specialCharacterInterval;
var lastMoved = "right";
var ghosts = [];
var deadGhosts = [];
var lives = 5;
var amountOfTotalFood;
var foodEaten;
var moveRight = 39;
var moveLeft = 37;
var moveUp = 38;
var moveDown = 40;
var setWay;
var firstFoodColor;
var firstFoodPoints;
var secondFoodColor;
var secondFoodPoints;
var thirdFoodColor;
var thirdFoodPoints;
var specialCharacter;
var strongMode = false;
var strongTimer;
let radius = 15;
let eyeRadius = 3;
let eyeXOffset = 7;
let eyeYOffset = 5;


$(document).ready(function () {
	context = canvas.getContext("2d");
	keysDown = {};
	addEventListener(
		"keydown",
		function (e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function (e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
});

function moveToGame() {//function that is being called after finishing to edit the settings
	if (!checkIfAllFieldsAreGood()) {//if there is a problem with some of the fields we won't start
		return;
	}
	firstFoodColor = document.getElementById("firstFoodColor").value;
	firstFoodPoints = parseInt(document.getElementById("firstFoodPoints").value);
	secondFoodColor = document.getElementById("secondFoodColor").value;
	secondFoodPoints = parseInt(document.getElementById("secondFoodPoints").value);
	thirdFoodColor = document.getElementById("thirdFoodColor").value;
	thirdFoodPoints = parseInt(document.getElementById("thirdFoodPoints").value);
	amountOfTotalFood = document.getElementById("amountOfFood").value;
	remainingTime = document.getElementById("amountOfTime").value;
	let amountOfGhosts = document.getElementById("amountOfGhosts").value;
	ghosts = [];
	if (amountOfGhosts > 0) {
		addGhost("red", 0, 10);
	}
	if (amountOfGhosts > 1) {
		addGhost("aqua", 15, 10);
	}
	if (amountOfGhosts > 2) {
		addGhost("pink", 0, 0);
	}
	if (amountOfGhosts > 3) {
		addGhost("orange", 15, 0);
	}
	specialCharacter = {
		x: 0,
		y: 0,
		alive: true
	}
	document.getElementById("gameboard").style.display = "none";
	document.getElementById("RightMoveButton").style.display = "none";
	document.getElementById("LeftMoveButton").style.display = "none";
	document.getElementById("UpMoveButton").style.display = "none";
	document.getElementById("DownMoveButton").style.display = "none";
	document.getElementById("RightMoveButton").style.display = "none";
	document.getElementById("firstFoodColor").disabled = true;
	//document.getElementById("firstFoodPoints").readOnly = true;
	document.getElementById("secondFoodColor").disabled = true;
	//document.getElementById("secondFoodPoints").readOnly = true;
	document.getElementById("thirdFoodColor").disabled = true;
	//document.getElementById("thirdFoodPoints").readOnly = true;
	document.getElementById("amountOfFood").readOnly = true;
	document.getElementById("amountOfTime").readOnly = true;
	document.getElementById("amountOfGhosts").readOnly = true;
	document.getElementById("randomSettingsButton").style.display = "none";
	document.getElementById("moveToGameButton").style.display = "none";
	document.getElementById("gameboard").style.display = "block";
	Start();
	gameSong = document.getElementById('gameSong');
	gameSong.volume = 0.6;
	gameSong.currentTime = 0;
	gameSong.play();
}

function setMoveRight() {
	document.removeEventListener('keydown', keydownHandler, false);
	setWay = "right";
	document.addEventListener('keydown', keydownHandler, false);
	window.alert("after exiting this message, press any key you want");
}

function setMoveLeft() {
	document.removeEventListener('keydown', keydownHandler, false);
	setWay = "left";
	document.addEventListener('keydown', keydownHandler, false);
	window.alert("after exiting this message, press any key you want");
}

function setMoveUp() {
	document.removeEventListener('keydown', keydownHandler, false);
	setWay = "up";
	document.addEventListener('keydown', keydownHandler, false);
	window.alert("after exiting this message, press any key you want");
}

function setMoveDown() {
	document.removeEventListener('keydown', keydownHandler, false);
	setWay = "down";
	document.addEventListener('keydown', keydownHandler, false);
	window.alert("after exiting this message, press any key you want");
}

function keydownHandler(e) {
	if (setWay == "right") {
		document.getElementById("RightMove").value = e.code;
		moveRight = e.keyCode;
	} else if (setWay == "left") {
		document.getElementById("LeftMove").value = e.code;
		moveLeft = e.keyCode;
	} else if (setWay == "up") {
		document.getElementById("UpMove").value = e.code;
		moveUp = e.keyCode;
	} else if (setWay == "down") {
		document.getElementById("DownMove").value = e.code;
		moveDown = e.keyCode;
	}
	document.removeEventListener('keydown', keydownHandler, false);
}

function addGhost(ghostColor, startX, startY) {
	let ghost = {
		x: startX,
		y: startY,
		color: ghostColor,
		initialX: startX,
		initialY: startY,
	};
	ghosts.push(ghost);
}

function countTimer() {
	remainingTime -= 0.1;
	if (remainingTime <= 0) {//Time's up
		removeGameIntervals();
		if (score < 100) {
			window.alert("You are better than " + score + " points!");
		}
		else {
			window.alert("Winner!!!");
		}
	}
	if (foodEaten == amountOfTotalFood) {//the player ate all the food and finished the game
		removeGameIntervals();
		window.alert("Game completed");
	}
	if (strongMode) {
		strongTimer -= 0.1
		if (strongTimer <= 0) {
			strongMode = false;
			window.clearInterval(ghostsInterval);
			ghostsInterval = setInterval(moveGhostSmartly, 700);
			deadGhosts = [];
		}
	}
	Draw();
}

function setSettingsRandom() {

	document.getElementById("RightMoveButton").value = "ArrowRight";
	document.getElementById("LeftMoveButton").value = "ArrowLeft";
	document.getElementById("UpMoveButton").value = "ArrowUp";
	document.getElementById("DownMoveButton").value = "ArrowDown";
	moveRight = 39;
	moveLeft = 37;
	moveUp = 38;
	moveDown = 40;
	document.getElementById("firstFoodColor").value = getRandomColor();
	document.getElementById("firstFoodPoints").value = Math.floor(Math.random() * 100) + 1;
	document.getElementById("secondFoodColor").value = getRandomColor();
	document.getElementById("secondFoodPoints").value = Math.floor(Math.random() * 100) + 1;
	document.getElementById("thirdFoodColor").value = getRandomColor();
	document.getElementById("thirdFoodPoints").value = Math.floor(Math.random() * 100) + 1;
	document.getElementById("amountOfFood").value = Math.floor(Math.random() * 40) + 50;
	document.getElementById("amountOfGhosts").value = Math.floor(Math.random() * 4) + 1;
	document.getElementById("amountOfTime").value = Math.floor(Math.random() * 60) + 60;
}

function getRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function removeGameIntervals() {
	window.clearInterval(interval);
	window.clearInterval(ghostsInterval);
	window.clearInterval(timeInterval);
	window.clearInterval(specialCharacterInterval);
	strongMode = false;
	strongTimer = 0;
	document.getElementById('gameSong').pause();
}

function restartGame() {
	removeGameIntervals();
	document.getElementById("RightMoveButton").style.display = "block";
	document.getElementById("LeftMoveButton").style.display = "block";
	document.getElementById("UpMoveButton").style.display = "block";
	document.getElementById("DownMoveButton").style.display = "block";
	document.getElementById("RightMoveButton").style.display = "block";
	document.getElementById("firstFoodColor").disabled = false;
	//document.getElementById("firstFoodPoints").readOnly = false;
	document.getElementById("secondFoodColor").disabled = false;
	//document.getElementById("secondFoodPoints").readOnly = false;
	document.getElementById("thirdFoodColor").disabled = false;
	//document.getElementById("thirdFoodPoints").readOnly = false;
	document.getElementById("amountOfFood").readOnly = false;
	document.getElementById("amountOfTime").readOnly = false;
	document.getElementById("amountOfGhosts").readOnly = false;
	document.getElementById("randomSettingsButton").style.display = "block";
	document.getElementById("moveToGameButton").style.display = "block";
	document.getElementById("gameboard").style.display = "none";
}

function Start() {
	ghostsInterval = setInterval(moveGhostSmartly, 700);
	interval = setInterval(UpdatePosition, 100);
	specialCharacter.x = 0;
	specialCharacter.y = 0;
	specialCharacterInterval = setInterval(moveSmileyRandomly, 700);
	timeInterval = setInterval(countTimer, 100);
	keysDown = [];
	foodEaten = 0;
	let totalFoodRemain = amountOfTotalFood;
	lives = 5;
	document.getElementById("lives").innerHTML = "Lives: " + lives
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 176;
	var secondFoodRemain = Math.floor(0.3 * totalFoodRemain);
	var thirdFoodRemain = Math.floor(0.1 * totalFoodRemain);
	var firstFoodRemain = totalFoodRemain - secondFoodRemain - thirdFoodRemain;
	start_time = new Date();
	for (let i = 0; i < 16; i++) {//every column
		board[i] = new Array();
		for (let j = 0; j < 11; j++) {//every row
			if (
				(i == 1 && j == 1) ||
				(i == 1 && j == 2) ||
				(i == 1 && j == 8) ||
				(i == 1 && j == 9) ||
				(i == 2 && j == 1) ||
				(i == 2 && j == 2) ||
				(i == 2 && j == 8) ||
				(i == 2 && j == 9) ||
				(i == 5 && j == 1) ||
				(i == 5 && j == 2) ||
				(i == 5 && j == 3) ||
				(i == 5 && j == 7) ||
				(i == 5 && j == 8) ||
				(i == 5 && j == 9) ||
				(i == 7 && j == 2) ||
				(i == 7 && j == 8) ||
				(i == 8 && j == 2) ||
				(i == 8 && j == 8) ||
				(i == 10 && j == 1) ||
				(i == 10 && j == 2) ||
				(i == 10 && j == 3) ||
				(i == 10 && j == 7) ||
				(i == 10 && j == 8) ||
				(i == 10 && j == 9) ||
				(i == 13 && j == 1) ||
				(i == 13 && j == 2) ||
				(i == 13 && j == 8) ||
				(i == 13 && j == 9) ||
				(i == 14 && j == 1) ||
				(i == 14 && j == 2) ||
				(i == 14 && j == 8) ||
				(i == 14 && j == 9)
			) {
				board[i][j] = 4;
			} else {
				let randomNum = Math.random();
				if (randomNum <= (1.0 * totalFoodRemain) / cnt) {
					randomNum = Math.floor(Math.random() * 3 + 1);
					if (randomNum == 1 && firstFoodRemain > 0) {
						board[i][j] = 1;
						firstFoodRemain--;
						totalFoodRemain--;
					} else if (randomNum == 2 && secondFoodRemain > 0) {
						board[i][j] = 10;
						secondFoodRemain--;
						totalFoodRemain--;
					} else if (randomNum == 3 && thirdFoodRemain > 0) {
						board[i][j] = 11;
						thirdFoodRemain--;
						totalFoodRemain--;
					}
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	let randomPlace = findRandomEmptyMiddleCell(board);
	shape.x = randomPlace[0];
	shape.y = randomPlace[1];
	board[shape.x][shape.y] = 2;
	while (totalFoodRemain > 0) {
		let emptyCell;
		for (let i = 0; i < thirdFoodRemain; i++) {
			emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 11;
			totalFoodRemain--;
		}
		for (let i = 0; i < secondFoodRemain; i++) {
			emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 10;
			totalFoodRemain--;
		}
		for (let i = 0; i < firstFoodRemain; i++) {
			emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 1;
			totalFoodRemain--;
		}
	}
	for (let i = 0; i < 2; i++) {
		emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 12;
	}
}

function findRandomEmptyCell(board) {
	let i = Math.floor(Math.random() * 14 + 1);
	let j = Math.floor(Math.random() * 10 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 14 + 1);
		j = Math.floor(Math.random() * 10 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[moveUp]) {
		lastMoved = "up";
		return 1;
	}
	if (keysDown[moveDown]) {
		lastMoved = "down";
		return 2;
	}
	if (keysDown[moveLeft]) {
		lastMoved = "left";
		return 3;
	}
	if (keysDown[moveRight]) {
		lastMoved = "right";
		return 4;
	}
}

function loseLiveAndRestart() {
	lives--;
	document.getElementById("lives").innerHTML = "Lives: " + lives
	score = Math.max(0, score - 10);
	if (lives > 0) {//the user can still play
		ghosts[0].x = 0;
		ghosts[0].y = 10;

		ghosts[1].x = 15;
		ghosts[1].y = 10;

		ghosts[1].x = 15;
		ghosts[1].y = 10;

		ghosts[2].x = 0;
		ghosts[2].y = 0;

		ghosts[3].x = 15;
		ghosts[3].y = 0;

		board[shape.x][shape.y] = 0;
		random = findRandomEmptyMiddleCell(board);
		shape.x = random[0];
		shape.y = random[1];
		board[shape.x][shape.y] = 2;
	} else {
		// the user used all his lives
		removeGameIntervals();
		window.alert("Loser!");
	}
}

function findRandomEmptyMiddleCell(board) {
	let i = Math.floor(Math.random() * 14 + 1);
	let j = Math.floor(Math.random() * 7 + 3);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 14 + 1);
		j = Math.floor(Math.random() * 7 + 3);
	}
	return [i, j];
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = remainingTime.toFixed(1);
	context.beginPath();
	context.moveTo(3 * 40, canvas.height / 2 - 20);
	context.lineTo(0, canvas.height / 2 - 20);
	context.lineTo(0, 0);
	context.lineTo(canvas.width, 0);
	context.lineTo(canvas.width, canvas.height / 2 - 20);
	context.lineTo(canvas.width - 3 * 40, canvas.height / 2 - 20);
	context.stroke();
	context.moveTo(3 * 40, canvas.height / 2 + 20);
	context.lineTo(0, canvas.height / 2 + 20);
	context.lineTo(0, canvas.height);
	context.lineTo(canvas.width, canvas.height);
	context.lineTo(canvas.width, canvas.height / 2 + 20);
	context.lineTo(canvas.width - 3 * 40, canvas.height / 2 + 20);
	context.stroke();
	for (let i = 0; i < 16; i++) {
		for (let j = 0; j < 11; j++) {
			let center = new Object();
			center.x = i * 40 + 20;
			center.y = j * 40 + 20;
			if (board[i][j] == 2) {
				if (lastMoved == "right") {
					context.beginPath();
					context.arc(center.x, center.y, 15, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 4, center.y - 7, 2, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				} else if (lastMoved == "left") {
					context.beginPath();
					context.arc(center.x, center.y, 15, 1.15 * Math.PI, 2.85 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x - 4, center.y - 7, 2, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				} else if (lastMoved == "up") {
					context.beginPath();
					context.arc(center.x, center.y, 15, 1.7 * Math.PI, 1.35 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 7, center.y - 4, 2, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				} else if (lastMoved == "down") {
					context.beginPath();
					context.arc(center.x, center.y, 15, 0.7 * Math.PI, 0.35 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 7, center.y, 2, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				}
			} else if (board[i][j] == 1) {// food1
				context.beginPath();
				context.arc(center.x, center.y, 3, 0, 2 * Math.PI); // circle
				context.fillStyle = firstFoodColor; //color
				context.fill();
			} else if (board[i][j] == 10) {// food2
				context.beginPath();
				context.arc(center.x, center.y, 3, 0, 2 * Math.PI); // circle
				context.fillStyle = secondFoodColor; //color
				context.fill();
			}
			else if (board[i][j] == 11) {// food3
				context.beginPath();
				context.arc(center.x, center.y, 3, 0, 2 * Math.PI); // circle
				context.fillStyle = thirdFoodColor; //color
				context.fill();
			}
			else if (board[i][j] == 12) {
				context.fillStyle = "red"; //red
				context.beginPath();
				context.arc(center.x, center.y, 5, 0, Math.PI, true);
				context.closePath();
				context.fill();

				context.fillStyle = "blue"; //blue
				context.beginPath();
				context.arc(center.x, center.y, 5, Math.PI, Math.PI * 2, true);
				context.closePath();
				context.fill();
			}
			else if (board[i][j] == 4) {// wall
				context.beginPath();
				context.rect(center.x - 20, center.y - 20, 40, 40);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
	if (specialCharacter.alive) {
		let smileyCenter = new Object();
		smileyCenter.x = specialCharacter.x * 40 + 20;
		smileyCenter.y = specialCharacter.y * 40 + 20;

		// draw the yellow circle
		context.beginPath();
		context.arc(smileyCenter.x, smileyCenter.y, radius, 0, 2 * Math.PI, false);
		context.fillStyle = 'yellow';
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.stroke();

		// draw the eyes
		context.beginPath();
		let eyeX = smileyCenter.x - eyeXOffset;
		let eyeY = smileyCenter.y - eyeYOffset;
		context.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
		eyeX = smileyCenter.x + eyeXOffset;
		context.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
		context.fillStyle = 'black';
		context.fill();

		// draw the mouth
		context.beginPath();
		context.arc(smileyCenter.x, smileyCenter.y + 2, 5, 0, Math.PI, false);
		context.stroke();
	}
	for (let i = 0; i < ghosts.length; i++) {//draw ghosts
		if (deadGhosts.includes(ghosts[i])) {//if it's dead we don't want to draw it
			continue;
		}
		let center = new Object();
		center.x = ghosts[i].x * 40 + 20;
		center.y = ghosts[i].y * 40 + 20;
		context.beginPath();
		context.arc(center.x, center.y - 5, 12, 1.0 * Math.PI, 2.0 * Math.PI);//draw the ghost
		context.lineTo(center.x + 12, center.y + 5 + 10);
		context.lineTo(center.x + 8, center.y + 5 + 8);
		context.lineTo(center.x + 4, center.y + 5 + 10);
		context.lineTo(center.x + 0, center.y + 5 + 8);
		context.lineTo(center.x - 4, center.y + 5 + 10);
		context.lineTo(center.x - 8, center.y + 5 + 8);
		context.lineTo(center.x - 12, center.y + 5 + 10);
		context.lineTo(center.x - 12, center.y + 5);
		if (strongMode) {
			context.fillStyle = "DarkBlue";
		}
		else {
			context.fillStyle = ghosts[i].color;
		}
		context.fill();

		context.beginPath();
		context.arc(center.x + 4, center.y - 4, 2, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
		context.beginPath();
		context.arc(center.x - 4, center.y - 4, 2, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
	}
}

function moveSmileyRandomly() {
	let randomNumber = Math.floor(Math.random() * 4) + 1;
	if(specialCharacter.alive) {
		moveSpecialCharacter(specialCharacter, randomNumber);
		Draw();
	}
}



function UpdatePosition() {
	board[shape.x][shape.y] = 0;
	var x = GetKeyPressed();
	if (x == 1) {//up
		if (shape.y > 0 && board[shape.x][shape.y - 1] != 4 && !((shape.y == 5 || shape.y == 6) && (shape.x < 3 || shape.x > 12))) {
			shape.y--;
		}
	}
	if (x == 2) {//down
		if (shape.y < 10 && board[shape.x][shape.y + 1] != 4 && !((shape.y == 5 || shape.y == 4) && (shape.x < 3 || shape.x > 12))) {
			shape.y++;
		}
	}
	if (x == 3) {//left
		if (shape.x > 0 && board[shape.x - 1][shape.y] != 4) {
			shape.x--;
		} else if (shape.y == 5 && shape.x == 0) {//need to teleport him to the other side
			shape.x = 15;
		}
	}
	if (x == 4) {//right
		if (shape.x < 15 && board[shape.x + 1][shape.y] != 4) {
			shape.x++;
		} else if (shape.y == 5 && shape.x == 15) {//need to teleport him to the other side
			shape.x = 0;
		}
	}
	if (board[shape.x][shape.y] == 1) {//eat first food
		score += firstFoodPoints;
		foodEaten++;
	}
	else if (board[shape.x][shape.y] == 10) {//eat second food
		score += secondFoodPoints;
		foodEaten++;
	}
	else if (board[shape.x][shape.y] == 11) {//eat third food
		score += thirdFoodPoints;
		foodEaten++;
	}
	else if (board[shape.x][shape.y] == 12) {//eat strong pill
		strongMode = true;
		strongTimer = 6;
		window.clearInterval(ghostsInterval);
		ghostsInterval = setInterval(moveGhostSmartly, 300);
	}
	if (shape.x == specialCharacter.x && shape.y == specialCharacter.y) {//if we touch the smiley
		specialCharacter.alive = false;
		specialCharacter.x = -1;
		specialCharacter.y = -1;
		score += 50;
	}
	board[shape.x][shape.y] = 2;
	for (let i = 0; i < ghosts.length; i++) {
		if (shape.x == ghosts[i].x && shape.y == ghosts[i].y) {
			if (deadGhosts.includes(ghosts[i])) {
				continue;
			}
			if (strongMode) {
				score += 20;
				deadGhosts.push(ghosts[i]);
				ghosts[i].x = ghosts[i].initialX;
				ghosts[i].y = ghosts[i].initialY;
			}
			else {
				if (ghosts[i].color == "red") {//if the ghost is red, it deals x2 dmg and minus x2 points
					if(lives > 1) {
						loseLiveAndRestart();
					}
				}
				loseLiveAndRestart();
			}
		}
	}
}

function moveGhost(creature, way) {
	if (way == 1) {//up
		if (creature.y > 0 && board[creature.x][creature.y - 1] != 4 && !((creature.y == 5 || creature.y == 6) && (creature.x < 3 || creature.x > 12))) {
			for (let i = 0; i < ghosts.length; i++) {
				if (creature.x == ghosts[i].x && creature.y - 1 == ghosts[i].y) {//if there is already a ghost in the spot so we stay in place
					return;
				}
			}
			creature.y--;
		}
	}
	if (way == 2) {//down
		if (creature.y < 10 && board[creature.x][creature.y + 1] != 4 && !((creature.y == 5 || creature.y == 4) && (creature.x < 3 || creature.x > 12))) {
			for (let i = 0; i < ghosts.length; i++) {
				if (creature.x == ghosts[i].x && creature.y + 1 == ghosts[i].y) {//if there is already a ghost in the spot so we stay in place
					return;
				}
			}
			creature.y++;
		}
	}
	if (way == 3) {//left
		if (creature.x > 0 && board[creature.x - 1][creature.y] != 4) {
			for (let i = 0; i < ghosts.length; i++) {
				if (creature.x - 1 == ghosts[i].x && creature.y == ghosts[i].y) {//if there is already a ghost in the spot so we stay in place
					return;
				}
			}
			creature.x--;
		}
		else if (creature.y == 5 && creature.x == 0) {//need to teleport him to the other side
			for (let i = 0; i < ghosts.length; i++) {
				if (ghosts[i].x == 15 && creature.y == ghosts[i].y) {//if there is already a ghost in the spot so we stay in place
					return;
				}
			}
			creature.x = 15;
		}
	}
	if (way == 4) {//right
		if (creature.x < 15 && board[creature.x + 1][creature.y] != 4) {
			for (let i = 0; i < ghosts.length; i++) {
				if (creature.x + 1 == ghosts[i].x && creature.y == ghosts[i].y) {//if there is already a ghost in the spot so we stay in place
					return;
				}
			}
			creature.x++;
		}
		else if (creature.y == 5 && creature.x == 15) {//need to teleport him to the other side
			for (let i = 0; i < ghosts.length; i++) {
				if (ghosts[i].x == 0 && creature.y == ghosts[i].y) {//if there is already a ghost in the spot so we stay in place
					return;
				}
			}
			creature.x = 0;
		}
	}
	if (shape.x == creature.x && shape.y == creature.y) {
		if (strongMode) {
			score += 20;
			creature.x = creature.initialX;
			creature.y = creature.initialY;
		}
		else {
			if (creature.color == "red") {//if the ghost is red, it deals x2 dmg and minus x2 points
				if(lives > 1) {
					loseLiveAndRestart();
				}
			}
			loseLiveAndRestart();
		}
	}
}

function checkIfAllFieldsAreGood() {
	let amountOfFoodValue = $('#amountOfFood').val();
	let amountOfTimeValue = $('#amountOfTime').val();
	let amountOfGhostsValue = $('#amountOfGhosts').val();
	let firstFoodPointsValue = $('#firstFoodPoints').val();
	let secondFoodPointsValue = $('#secondFoodPoints').val();
	let thirdFoodPointsValue = $('#thirdFoodPoints').val();
	if (isNaN(amountOfFoodValue) || isNaN(amountOfTimeValue) || isNaN(amountOfGhostsValue) || isNaN(firstFoodPointsValue) || isNaN(secondFoodPointsValue) || isNaN(thirdFoodPointsValue)) {
		window.alert("Please enter only numbers");
		return false;
	}
	if (amountOfFoodValue < 50 || amountOfFoodValue > 90) {
		window.alert("Amount of food must be between 50 and 90");
		return false;
	}
	if (amountOfTimeValue < 60) {
		window.alert("Amount of time must be at least 60");
		return false;
	}
	if (amountOfGhostsValue < 1 || amountOfGhostsValue > 4) {
		window.alert("Amount of ghosts must be between 1 and 4");
		return false;
	}
	return true;
}
//smart ghost movment
function moveGhostSmartly() {
	for (let i = 0; i < ghosts.length; i++) {
		if (deadGhosts.includes(ghosts[i])) {
			continue;
		}
		let CordianteX = ghosts[i].x;
		let CordianteY = ghosts[i].y;
		let PacmanX = shape.x;
		let PacmanY = shape.y;
		let boolean = false;
		let disX = Math.abs(PacmanX - CordianteX);
		let disY = Math.abs(PacmanY - CordianteY);
		let randNum = Math.floor(Math.random() * 4) + 1
		if (randNum == 1) {
			// Down = 2
			if (PacmanY > CordianteY && board[ghosts[i].x][ghosts[i].y + 1] != 4 && !((ghosts[i].y == 5 || ghosts[i].y == 4) && (ghosts[i].x < 3 || ghosts[i].x > 12))) {
				if (strongMode) {
					moveGhost(ghosts[i], 1);
				}
				else {
					moveGhost(ghosts[i], 2);
				}
			}
			// Up = 1
			else if (PacmanY < CordianteY && board[ghosts[i].x][ghosts[i].y - 1] != 4 && !((ghosts[i].y == 5 || ghosts[i].y == 6) && (ghosts[i].x < 3 || ghosts[i].x > 12))) {
				if (strongMode) {
					moveGhost(ghosts[i], 2);
				}
				else {
					moveGhost(ghosts[i], 1);
				}
			}
			// Right = 4
			else if (Math.abs(PacmanX - (CordianteX + 1)) < disX && board[ghosts[i].x + 1][ghosts[i].y] != 4) {
				if (strongMode) {
					moveGhost(ghosts[i], 3);
				}
				else {
					moveGhost(ghosts[i], 4);
				}
			}
			// Left = 3
			else if (Math.abs(PacmanX - (CordianteX - 1)) < disX && board[ghosts[i].x - 1][ghosts[i].y] != 4) {
				if (strongMode) {
					moveGhost(ghosts[i], 4);
				}
				else {
					moveGhost(ghosts[i], 3);
				}
			}
		} else if (randNum == 2) {
			// Up = 1
			if (PacmanY < CordianteY && board[ghosts[i].x][ghosts[i].y - 1] != 4 && !((ghosts[i].y == 5 || ghosts[i].y == 6) && (ghosts[i].x < 3 || ghosts[i].x > 12))) {
				if (strongMode) {
					moveGhost(ghosts[i], 2);
				}
				else {
					moveGhost(ghosts[i], 1);
				}
			}
			// Right = 4
			else if (Math.abs(PacmanX - (CordianteX + 1)) < disX && board[ghosts[i].x + 1][ghosts[i].y] != 4) {
				if (strongMode) {
					moveGhost(ghosts[i], 3);
				}
				else {
					moveGhost(ghosts[i], 4);
				}
			}
			// Left = 3
			else if (Math.abs(PacmanX - (CordianteX - 1)) < disX && board[ghosts[i].x - 1][ghosts[i].y] != 4) {
				if (strongMode) {
					moveGhost(ghosts[i], 4);
				}
				else {
					moveGhost(ghosts[i], 3);
				}
			}
			// Down = 2
			else if (PacmanY > CordianteY && board[ghosts[i].x][ghosts[i].y + 1] != 4 && !((ghosts[i].y == 5 || ghosts[i].y == 4) && (ghosts[i].x < 3 || ghosts[i].x > 12))) {
				if (strongMode) {
					moveGhost(ghosts[i], 1);
				}
				else {
					moveGhost(ghosts[i], 2);
				}
			}
		} else if (randNum == 3) {
			// Right = 4
			if (Math.abs(PacmanX - (CordianteX + 1)) < disX && board[ghosts[i].x + 1][ghosts[i].y] != 4) {
				if (strongMode) {
					moveGhost(ghosts[i], 3);
				}
				else {
					moveGhost(ghosts[i], 4);
				}
			}
			// Left = 3
			else if (Math.abs(PacmanX - (CordianteX - 1)) < disX && board[ghosts[i].x - 1][ghosts[i].y] != 4) {
				if (strongMode) {
					moveGhost(ghosts[i], 4);
				}
				else {
					moveGhost(ghosts[i], 3);
				}
			}
			// Down = 2
			else if (PacmanY > CordianteY && board[ghosts[i].x][ghosts[i].y + 1] != 4 && !((ghosts[i].y == 5 || ghosts[i].y == 4) && (ghosts[i].x < 3 || ghosts[i].x > 12))) {
				if (strongMode) {
					moveGhost(ghosts[i], 1);
				}
				else {
					moveGhost(ghosts[i], 2);
				}
			}
			// Up = 1
			else if (PacmanY < CordianteY && board[ghosts[i].x][ghosts[i].y - 1] != 4 && !((ghosts[i].y == 5 || ghosts[i].y == 6) && (ghosts[i].x < 3 || ghosts[i].x > 12))) {
				if (strongMode) {
					moveGhost(ghosts[i], 2);
				}
				else {
					moveGhost(ghosts[i], 1);
				}
			}
		} else if (randNum == 4) {
			// Left = 3
			if (Math.abs(PacmanX - (CordianteX - 1)) < disX && board[ghosts[i].x - 1][ghosts[i].y] != 4) {
				if (strongMode) {
					moveGhost(ghosts[i], 4);
				}
				else {
					moveGhost(ghosts[i], 3);
				}
			}
			// Down = 2
			else if (PacmanY > CordianteY && board[ghosts[i].x][ghosts[i].y + 1] != 4 && !((ghosts[i].y == 5 || ghosts[i].y == 4) && (ghosts[i].x < 3 || ghosts[i].x > 12))) {
				if (strongMode) {
					moveGhost(ghosts[i], 1);
				}
				else {
					moveGhost(ghosts[i], 2);
				}
			}
			// Up = 1
			else if (PacmanY < CordianteY && board[ghosts[i].x][ghosts[i].y - 1] != 4 && !((ghosts[i].y == 5 || ghosts[i].y == 6) && (ghosts[i].x < 3 || ghosts[i].x > 12))) {
				if (strongMode) {
					moveGhost(ghosts[i], 2);
				}
				else {
					moveGhost(ghosts[i], 1);
				}
			}
			// Right = 4
			else if (Math.abs(PacmanX - (CordianteX + 1)) < disX && board[ghosts[i].x + 1][ghosts[i].y] != 4) {
				if (strongMode) {
					moveGhost(ghosts[i], 3);
				}
				else {
					moveGhost(ghosts[i], 4);
				}
			}
		}
	}
}

function moveSpecialCharacter(smiley, way) {
	if (way == 1) {//up
		if (smiley.y > 0 && board[smiley.x][smiley.y - 1] != 4 && !((smiley.y == 5 || smiley.y == 6) && (smiley.x < 3 || smiley.x > 12))) {
			smiley.y--;
		}
	}
	if (way == 2) {//down
		if (smiley.y < 10 && board[smiley.x][smiley.y + 1] != 4 && !((smiley.y == 5 || smiley.y == 4) && (smiley.x < 3 || smiley.x > 12))) {
			smiley.y++;
		}
	}
	if (way == 3) {//left
		if (smiley.x > 0 && board[smiley.x - 1][smiley.y] != 4) {
			smiley.x--;
		}
		else if (smiley.y == 5 && smiley.x == 0) {//need to teleport him to the other side
			smiley.x = 15;
		}
	}
	if (way == 4) {//right
		if (smiley.x < 15 && board[smiley.x + 1][smiley.y] != 4) {
			smiley.x++;
		}
		else if (smiley.y == 5 && smiley.x == 15) {//need to teleport him to the other side
			smiley.x = 0;
		}
	}
	if (shape.x == smiley.x && shape.y == smiley.y) {
		smiley.alive = false;
		smiley.x = -1;
		smiley.y = -1;
		score += 50;
	}
}