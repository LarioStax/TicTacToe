let box = document.getElementsByClassName("box");
let resetButton = document.getElementById("reset");
let restartButton = document.getElementById("restart");
let scoreDisplay1 = document.getElementById("score1");
let scoreDisplay2 = document.getElementById("score2");
let turnDisplay = document.getElementById("turnDisplay");
let gameDisplay = document.getElementById("gameDisplay");
turnDisplay.innerHTML = "Spaceholder";
gameDisplay.innerHTML = "Spaceholder";

let player1 = {
	icon: "X",
	color: "blue",
	turn: true,
	moves: [],
	wins: false,
	numOfWins: 0,
}

let player2 = {
	icon: "O",
	color: "red",
	turn: false,
	moves: [],
	wins: false,
	numOfWins: 0,
}

let board = {
	winningCombos: [
		[1,2,3],
		[4,5,6],
		[7,8,9],
		[1,4,7],
		[2,5,8],
		[3,6,9],
		[1,5,9],
		[3,5,7],
	],
	playedMoves: [],
	gameOver: false,
	blinking: "",
	blinkingCounter: 0,
	restartCountdown: "",
}


initialise();

function initialise() {
	setupGameLogic();
	setupButtons();
	reset();
	updateScore();
}

function setupGameLogic() {
	for (let i = 0; i<box.length; i++) {
		box[i].addEventListener("click", function() {
			if (!board.gameOver) {
				let boxNumber = Number(this.id[this.id.length-1]);
					if (checkIfEmpty(boxNumber)) {
						board.playedMoves.push(boxNumber);
						if (player1.turn) {
							click(this, player1, boxNumber)
						} else if (player2.turn) {
							click(this, player2, boxNumber)
						}
						updatePlayerDisplay();
						checkIfOver();					
					};
			} else {
				console.log("Stop clicking, game already finished.");
			}
		});
	}
}


function setupButtons() {
	resetButton.addEventListener("click", reset);
	restartButton.addEventListener("click", restart);
}


//restarts the game, but keeps the scores
function restart() {
	restartCountdownStop();
	stopBlinking();
	player1.moves = [];
	player1.turn = true;
	player1.wins = false;
	player2.moves = [];
	player2.turn = false;
	player2.wins = false;
	board.playedMoves = [];
	board.gameOver = false;
	board.blinkingCounter = 0;
	for (let i = 0; i<box.length; i++) {
		box[i].style.backgroundColor = "grey";
	}
	updateScore();
	updatePlayerDisplay();
	showGameDisplay();
	showTurnDisplay();
}

//resets the scores and restarts the game;
function reset() {
	player1.numOfWins = 0;
	player2.numOfWins = 0;
	restart();
}

function updateScore() {
	scoreDisplay1.innerHTML = `${player1.color.toUpperCase()} : ${player1.numOfWins}`;
	scoreDisplay2.innerHTML = `${player2.color.toUpperCase()} : ${player2.numOfWins}`;
}


function updatePlayerDisplay() {
	if (player1.turn) {
		turnDisplay.innerHTML = `Current Player: ${player1.color.toUpperCase()}`
	} else if (player2.turn) {
		turnDisplay.innerHTML = `Current Player: ${player2.color.toUpperCase()}`
	}
}

//Checks if no player had won and all 9 boxes have been taken ==> game over.
function checkIfOver() {
	if (!player1.wins && !player2.wins) {
		if (board.playedMoves.length === 9) {
			setGameOver();	
			gameDisplay.innerHTML = "Game over. With no winners. Nubs.";
			showGameDisplay();
		}
	}
}

//Checks if clicked box hasn't been taken already
function checkIfEmpty(clickedBox) {
	if (!board.playedMoves.includes(clickedBox)) {
		return true;
	} else {
		return false;
	}
}

//Sets game as over and start countdown to auto-restarting the game in 5 secsonds
function setGameOver() {
	board.gameOver = true;
	updateScore();
	restartCountdownStart();
}

//Starts the countdown
function restartCountdownStart() {
	board.restartCountdown = setTimeout(restart, 5000);
}

//Stops the countdown
function restartCountdownStop() {
	clearTimeout(board.restartCountdown)
}

//Loops through winningCombos and check wether the player that just played made a winning combination! If so, blinks the winning combination, set's the game as over and notifies players.
function checkIfWon(player) {
	for (let i = 0; i<board.winningCombos.length; i++) {
		let check1 = board.winningCombos[i][0];
		let check2 = board.winningCombos[i][1];
		let check3 = board.winningCombos[i][2];

		if (player.moves.includes(check1) && player.moves.includes(check2) && player.moves.includes(check3)) {
			player.wins = true;
			player.numOfWins++;
			blinkBoxes(check1, check2, check3);
			setGameOver();
			gameDisplay.innerHTML = player.color.toUpperCase() + " wins in " + board.playedMoves.length + " moves!!";
			showGameDisplay();
			break;
		}
	}
}

// hides game display and shows turn display
function showTurnDisplay() {
	turnDisplay.classList.remove("invisible");
	gameDisplay.classList.add("invisible");
}

// hides turn display and shows game display
function showGameDisplay() {
	turnDisplay.classList.add("invisible");
	gameDisplay.classList.remove("invisible");
}



//REPEATED CODE - FIND OUT HOW TO FIX THIS!
//Function makes the winning combo boxes blink 10 times!
function blinkBoxes(num1, num2, num3) {
	let highlight1 = (document.getElementById("box" + num1));
	let highlight2 = (document.getElementById("box" + num2));
	let highlight3 = (document.getElementById("box" + num3));

	highlight1.style.visibility = "hidden";
	highlight2.style.visibility = "hidden";
	highlight3.style.visibility = "hidden";

	setTimeout(function() {
		highlight1.style.visibility = "visible";
		highlight2.style.visibility = "visible";
		highlight3.style.visibility = "visible";
	},50);

	board.blinking = setTimeout(function() {
		if (board.blinkingCounter<10) {
			blinkBoxes(num1,num2,num3);
		}
	}, 100);

	//FIND OUT HOW TO AVOID THIS COUNTER AND STILL MAKE IT BLINK ONLY 10 TIMES
	board.blinkingCounter++;
}

//Stops blinking of boxes
function stopBlinking() {
	clearTimeout(board.blinking);
}



function changePlayer() {
	if (player1.turn === true) {
		player1.turn = false;
		player2.turn = true;
	} else if (player2.turn === true) {
		player2.turn = false;
		player1.turn = true;

	}
}


//Changes the background color of the clicked box, adds the box number to player moves array, checks wether he has made a winning combination and if not, changes the players.
function click(box, player, square) {
	box.style.backgroundColor = player.color;
	player.moves.push(square);
	checkIfWon(player);
	changePlayer();
}
