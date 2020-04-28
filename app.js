var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var remainingTime
var interval;
var ghostsInterval;
var timeInterval;
var lastMoved = "right";
var ghosts = [];
var lives = 5;
var amountOfTotalFood = 50;
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
	firstFoodColor = document.getElementById("firstFoodColor").value;
	firstFoodPoints = parseInt(document.getElementById("firstFoodPoints").value);
	secondFoodColor = document.getElementById("secondFoodColor").value;
	secondFoodPoints = parseInt(document.getElementById("secondFoodPoints").value);
	thirdFoodColor = document.getElementById("thirdFoodColor").value;
	thirdFoodPoints = parseInt(document.getElementById("thirdFoodPoints").value);
	amountOfTotalFood = document.getElementById("amountOfFood").value;
	document.getElementById("gameboard").style.display = "block";
	Start();
}

function setMoveRight() {
	document.removeEventListener('keydown', keydownHandler, false);
	setWay = "right";
	document.addEventListener('keydown', keydownHandler, false);
	window.alert("Press a key you want");
}

function setMoveLeft() {
	document.removeEventListener('keydown', keydownHandler, false);
	setWay = "left";
	document.addEventListener('keydown', keydownHandler, false);
	window.alert("Press a key you want");
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
	window.alert("Press a key you want");
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
		initialY: startY
	};
	ghosts.push(ghost);
}

function countTimer() {
	remainingTime -= 0.1;
	if (remainingTime <= 0) {//Time's up
		window.clearInterval(interval);
		window.clearInterval(ghostsInterval);
		window.clearInterval(timeInterval);
		if (score < 100) {
			window.alert("You are better than " + score + " points!");
		}
		else {
			window.alert("Winner!!!");
		}
	}
	Draw();
	if (foodEaten == amountOfTotalFood) {//the player ate all the food and finished the game
		window.clearInterval(interval);
		window.clearInterval(ghostsInterval);
		window.clearInterval(timeInterval);
		window.alert("Game completed");
	}
}

function restartGame() {
	window.clearInterval(interval);
	window.clearInterval(ghostsInterval);
	window.clearInterval(timeInterval);
	
	document.getElementById("chooseSettings").style.display = "block";
	document.getElementById("gameboard").style.display = "none";

	/*ghostsInterval = setInterval(moveGhostRandomly, 200);
	interval = setInterval(UpdatePosition, 100);
	timeInterval = setInterval(countTimer, 100);*/
	
	//Start();
}

function Start() {
	ghostsInterval = setInterval(moveGhostRandomly, 200);
	interval = setInterval(UpdatePosition, 100);
	timeInterval = setInterval(countTimer, 100);
	keysDown = [];
	foodEaten = 0;
	let totalFoodRemain = amountOfTotalFood;
	lives = 5;
	document.getElementById("lives").innerHTML = "Lives: " + lives
	remainingTime = 50.0;
	ghosts = [];
	addGhost("red", 0, 10);
	addGhost("aqua", 15, 10);
	addGhost("pink", 0, 0);
	addGhost("orange", 15, 0);
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 176;
	var firstFoodRemain = Math.ceil(0.6 * totalFoodRemain);
	var secondFoodRemain = Math.floor(0.3 * totalFoodRemain);
	var thirdFoodRemain = Math.floor(0.1 * totalFoodRemain);
	var pacman_remain = 1;
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
				} else if (randomNum < (1.0 * (pacman_remain + totalFoodRemain)) / cnt) {
					shape.x = i;
					shape.y = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
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

		ghosts[2].x = 0;
		ghosts[2].y = 0;

		ghosts[3].x = 15;
		ghosts[3].y = 0;

		board[shape.x][shape.y] = 0;
		random = findRandomEmptyCell(board);
		shape.x = random[0];
		shape.y = random[1];

	}
	else { // the user used all his lives
		window.clearInterval(interval);
		window.clearInterval(ghostsInterval);
		window.clearInterval(timeInterval);
		window.alert("Loser!");
	}
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
				context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = firstFoodColor; //color
				context.fill();
			} else if (board[i][j] == 10) {// food2
				context.beginPath();
				context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = secondFoodColor; //color
				context.fill();
			}
			else if (board[i][j] == 11) {// food3
				context.beginPath();
				context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = thirdFoodColor; //color
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
	for (let i = 0; i < ghosts.length; i++) {//draw ghosts
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
		context.fillStyle = ghosts[i].color; //color
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

function moveGhostRandomly() {
	for (let i = 0; i < ghosts.length; i++) {
		let randomNumber = Math.floor(Math.random() * 4) + 1;
		moveGhost(ghosts[i], randomNumber);
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
		}
		else if (shape.y == 5 && shape.x == 0) {//need to teleport him to the other side
			shape.x = 15;
		}
	}
	if (x == 4) {//right
		if (shape.x < 15 && board[shape.x + 1][shape.y] != 4) {
			shape.x++;
		}
		else if (shape.y == 5 && shape.x == 15) {//need to teleport him to the other side
			shape.x = 0;
		}
	}
	if (board[shape.x][shape.y] == 1) {//if it's a normal score we raise the score
		score += firstFoodPoints;
		foodEaten++;
	}
	if (board[shape.x][shape.y] == 10) {//if it's a middle score we raise the score
		score += secondFoodPoints;
		foodEaten++;
	}
	if (board[shape.x][shape.y] == 11) {//if it's a high score we raise the score
		score += thirdFoodPoints;
		foodEaten++;
	}
	board[shape.x][shape.y] = 2;
	for (let i = 0; i < ghosts.length; i++) {
		if (shape.x == ghosts[i].x && shape.y == ghosts[i].y) {
			loseLiveAndRestart();
		}
	}
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
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
		loseLiveAndRestart();
	}
}
