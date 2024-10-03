// --------------------> GAME CONSTANTS & VARIABLES

let inputDir = { x: 0, y: 0 };
let scoreBox = document.querySelector(".scoreBox");
let highScoreBox = document.querySelector(".highScoreBox");
const board = document.querySelector(".board");
const foodSound = new Audio("audio/food_eating.mp3");
const gameOverSound = new Audio("audio/game-over-arcade.mp3");
const gameSound = new Audio("audio/arcade-game-bg-audio.mp3");
let score = 0;
let speed = 5;
let lastPaintTime = 0;

snakeArr = [{ x: 3, y: 10 }];
food = { x: 13, y: 10 };

// ----------------------------------------> GAME FUNCTIONS

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // If snake bumps into itself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // If snake bumps into boundries
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  // Part-1 Updating the snake array and food
  if (isCollide(snakeArr)) {
    gameSound.pause();
    gameOverSound.play();
    inputDir = { x: 0, y: 0 };
    alert("Game Over !\nPress any key to restart game.");
    snakeArr = [{ x: 3, y: 10 }];
    gameSound.play();
    score = 0;
    speed = 5;
  }

  // If the food was eaten, increment the score and regenerate of food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    speed += 0.5;
    score++;
    if (score >= highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("highScore", JSON.stringify(highScoreVal));
      highScoreBox.innerHTML = "HighScore: " + highScoreVal;
    }

    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Part-2 Display the snake and food
  // Display the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // Display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// ----------------------------------------> GAME LOGIC

let highScore = localStorage.getItem("highScore");
if (highScore === null) {
  highScoreVal = 0;
  localStorage.setItem("highScore", JSON.stringify(highScoreVal));
} else {
  highScoreVal = JSON.parse(highScore);
  highScoreBox.innerHTML = "High-Score: " + highScore;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  inputDir = { x: 0, y: 1 }; //Start game
  gameSound.play();
  gameSound.volume = 0.5;
  switch (e.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;

    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;

    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;

    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;
  }
});
