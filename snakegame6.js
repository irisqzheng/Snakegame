var width = 25;
var height = 25;
var snakeX = 3;
var snakeY = 3;
var fruitX;
var fruitY;
var length = 0; // the original length of the snake
var interval; //setInterval Loop function
var time; //variavle be used in setInterval sentence
var haveFruit = false;
var direction = 3; // up is 0, down is -1, left is 1, right is 2
var tempdirection;
var running = false;
var gameOver = false;
var tailX = [snakeX];
var tailY = [snakeY];
var score = 0;
var increment = 5;

function run() {
  initiate();
  interval = setInterval(gameLoop, 100);
}

function initiate() {
  createMap();
  createSnake();
  createFruit();
  createBarrier();
}

function getType(x, y) {
  if (x != null && y != null)
    return getTb(x, y).getAttribute("class");
}

function getTb(x, y) {
  if (x != null || y != null)
    return document.getElementById(x + "-" + y);
}

function setClass(x, y, value) {
  if (x != null && y != null) {
    getTb(x, y).setAttribute("class", value);
  }
}

function createMap() {
  document.write("<div id = 'play-board'><table>");
  for (var y = 0; y < height; y++) {
    document.write("<tr>");
    for (var x = 0; x < width; x++) {
      if (x == 0 || y == 0 || x == width - 1 || y == height - 1) {
        document.write("<td class = 'wall' id='" + x + "-" + y + "'></td>");
      } else {
        document.write("<td class = 'blank' id = '" + x + "-" + y + "'></td>");
      }
    }
    document.write("</tr>")
  }
  document.write("</table><div>");
}

function createSnake() {
  setClass(snakeX, snakeY, "snake");
}

function rand(max, min) {
  return Math.floor(Math.random() * (max - min) + min);
}

function createFruit() {
  var ifhaveFruit = false;

  while (!ifhaveFruit && (length < (width - 1) * (height - 1) + 1)) {
    var fruitX1 = rand(width - 1, 1);
    var fruitY1 = rand(height - 1, 1);
    if (getType(fruitX1, fruitY1) == "blank")
      ifhaveFruit = true;
    fruitX = fruitX1;
    fruitY = fruitY1;
  }

  setClass(fruitX, fruitY, "fruit");
}

var barrierNumber = 0;
var barXrecord = [];
var barYrecord = [];
var barX = [];
var barY = [];
var barrierX = [
  [0, 0, -1, 1],
  [0, -1, 1, 1],
  [-1, -1, 0, 1],
  [0, 0, 1, 1]
];
var barrierY = [
  [0, -1, 0, 0],
  [0, 0, 0, -1],
  [-1, 0, 0, 0],
  [0, -1, 0, -1]
];

function createBarrier() {
  var establish = false;

  while (!establish && length < (height - 1) * (width - 1) + 1) {
    var check = true;
    var barrier1X = rand(width - 1, 1);
    var barrier1Y = rand(height - 1, 1);
    var barrierType = rand(barrierX.length - 1, 0);
    for (var i = 0; i < 4; i++) {
      barX[i] = barrierX[barrierType][i] + barrier1X;
      barY[i] = barrierY[barrierType][i] + barrier1Y;
      if (getType(barX[i], barY[i]) != "blank" || (barX[i] == fruitX && barY[i] == fruitY) || barX[i] == 0 || barY[i] == 0 || barY[i] == height || barX[i] == width) {
        check = false;
      }
    }
    if (check) {
      establish = true;
      barrierNumber++;
    }

  }
  for (var i = 0; i < 4; i++) {
    setClass(barX[i], barY[i], "barrier");
    barXrecord[barrierNumber * 4 + i] = barX[i];
    barYrecord[barrierNumber * 4 + i] = barY[i];

  }
}

function continueGame() {
  running = true;
  document.getElementById("game-pause").style.display = "none";
}

function restartGame() {
  location.reload();
  document.getElementById("game-stop").style.display = "none";
}
window.addEventListener("keypress", function key(event) {
  var key = event.keyCode;
  if (direction != -1 && (key == 119 || key == 87)) {
    tempdirection = 0;
  }

  if (direction != 0 && (key == 115 || key == 83)) {
    tempdirection = -1;
  }

  if (direction != 2 && (key == 97 || key == 65)) {
    tempdirection = 1;
  }

  if (direction != 1 && (key == 100 || key == 68)) {
    tempdirection = 2;
  }

  if (!running) {
    running = true;
    document.getElementById("game-pause").style.display = "none";

  } else if (key == 32) {
    if (!gameOver) {
      running = false;
      document.getElementById("game-pause").style.display = "block";
    }

  }
});

function gameLoop() {
  if (running && !gameOver) {
    upDate();
  } else if (gameOver) {
    clearInterval(interval);
    document.getElementById("game-stop").style.display = "block";
  }
}

function upDate() {
  setClass(fruitX, fruitY, "fruit")
  direction = tempdirection;
  setClass(fruitX, fruitY, "fruit");
  setTail();
  setClass(tailX[length], tailY[length], "blank");



  if (direction == -1)
    snakeY++;

  else if (direction == 0)
    snakeY--;

  else if (direction == 1)
    snakeX--;

  else if (direction == 2)
    snakeX++;

  setClass(snakeX, snakeY, "snake");

  for (var i = tailX.length - 1; i >= 0; i--) {
    if (snakeX == tailX[i] && snakeY == tailY[i]) {
      gameOver = true;
      break;
    }
  }
  for (var i = 0; i < barXrecord.length; i++) {
    if (snakeX == barXrecord[i] && snakeY == barYrecord[i]) {
      gameOver = true;
      break;
    }
  }

  if (snakeX == 0 || snakeY == 0 || snakeX == width - 1 || snakeY == height - 1) {
    gameOver = true;
  } else if (snakeX == fruitX && snakeY == fruitY) {
    score += 4;
    createFruit();
    createBarrier();
    length += increment;
  }
  document.getElementById("score").innerHTML = "SCORE :" + score;


}

function setOpacity(x, y, a) {
  if (x != null && y != null)
    getTb(x, y).style.opacity = (1 - 1 / length * a) * 0.8 + 0.2;

}

function setTail() {
  for (var i = length; i > 0; i--) {
    tailX[i] = tailX[i - 1];
    tailY[i] = tailY[i - 1]
    setOpacity(tailX[i], tailY[i], i)
  }
  tailX[0] = snakeX;
  tailY[0] = snakeY;
}


run();