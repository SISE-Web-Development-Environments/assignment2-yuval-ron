var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;

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
	interval = setInterval(UpdatePosition, 150);
});

function Start() {
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (let i = 0; i < 16; i++) {//every column
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
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
				/*(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)*/
			) {
				board[i][j] = 4;
			} else {
				let randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	context.beginPath();
	context.moveTo(3 * 40,canvas.height / 2 - 20);
	context.lineTo(0, canvas.height / 2 - 20);
	context.lineTo(0, 0);
	context.lineTo(canvas.width, 0);
	context.lineTo(canvas.width, canvas.height / 2 - 20);
	context.lineTo(canvas.width - 3 * 40,canvas.height / 2 - 20);
	context.stroke();
	context.moveTo(3 * 40,canvas.height / 2 + 20);
	context.lineTo(0, canvas.height / 2 + 20);
	context.lineTo(0, canvas.height);
	context.lineTo(canvas.width, canvas.height);
	context.lineTo(canvas.width, canvas.height / 2 + 20);
	context.lineTo(canvas.width - 3 * 40,canvas.height / 2 + 20);
	context.stroke();
	for (var i = 0; i < 16; i++) {
		for (var j = 0; j < 11; j++) {
			var center = new Object();
			center.x = i * 40 + 20;
			center.y = j * 40 + 20;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 4, center.y - 7, 2, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 20, center.y - 20, 40, 40);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {//up
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4 && !((shape.j == 5 || shape.j == 6) && (shape.i < 3 || shape.i > 13))) {
			shape.j--;
		}
	}
	if (x == 2) {//down
		if (shape.j < 10 && board[shape.i][shape.j + 1] != 4 && !((shape.j == 5 || shape.j == 4) && (shape.i < 3 || shape.i > 13))) {
			shape.j++;
		}
	}
	if (x == 3) {//left
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {//right
		if (shape.i < 15 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}
