// Fetching some important elements -> game-board, rod1, rod2, ball
const gameBoard = document.getElementById("game-board");
const rod1 = document.getElementById("rod1");
const rod2 = document.getElementById("rod2");
const ball = document.getElementById("ball");

// Some important data here
const boardPos = gameBoard.getBoundingClientRect();
const ROD_MOVEMENT = 25;
const BALL_MOVEMENT = 3;

// Scores
let score1 = 0;
let score2 = 0;
let highestScore = localStorage.getItem("highest-score");

// If this is the first time, then highestScore would be set to NULL
// So we can just set values of highestScore manually
if (!highestScore) {
  localStorage.setItem("highest-score", "0");
  highestScore = 0;
}
highestScore = parseInt(highestScore, 10);

// Key Mapping, this will help us to keep the code clean
const keyMap = {
  a: "left",
  A: "left",
  ArrowLeft: "left",
  d: "right",
  D: "right",
  ArrowRight: "right"
};

// this object will help us to know where the ball is going to move
let ballMovement = {
  movement: 0, // this will tell if the ball is moving or not
  start: 1, // if start is 1 then ball will be given to rod2, else rod2
  left: 0, // either 'right' would be true or 'left' would be true
  right: 0, // and the other one would be false
  up: 0, // same happens here, either 'up' or 'down' would be true
  down: 0 // and the other one would be false
};

// Alert message when we start the game
alert(
  "Hello there,\nWelcome to this Ping Pong Game\nYou can control the rods with 'A' & 'D' or arrow keys\n" +
    (highestScore
      ? "The highest score till now is " + highestScore
      : "This is the first time you have been playing this game")
);

// this function will keep moving the ball and check if there is a score or not
// The interval is set to 16ms so that there would be around 60 frames per second
setInterval(function () {
  moveBall();
  roundOver();
}, 16);

// this event listener would take care of moving the rods for us
window.addEventListener("keydown", function (event) {
  let key = event.key;
  let rodPos = rod1.getBoundingClientRect();

  // this block of code will move the rods as we press the left or right keys
  if (keyMap[key] === "left" && rodPos.left >= boardPos.left) {
    rod1.style.left = rod1.offsetLeft - ROD_MOVEMENT + "px";
    rod2.style.left = rod2.offsetLeft - ROD_MOVEMENT + "px";
    // here this block of code will check if the ball is moving or not
    // if the ball is not moving, then it will give it direction according to the rod and movement direction
    if (ballMovement.movement === 0) {
      ballMovement.movement = 1;
      ballMovement.left = 1;
      if (ballMovement.start === 1) ballMovement.up = 1;
      else ballMovement.down = 1;
    }
  }
  // this block of code will move the rods as we press the left or right keys
  if (keyMap[key] === "right" && rodPos.right <= boardPos.right) {
    rod1.style.left = rod1.offsetLeft + ROD_MOVEMENT + "px";
    rod2.style.left = rod2.offsetLeft + ROD_MOVEMENT + "px";
    // here this block of code will check if the ball is moving or not
    // if the ball is not moving, then it will give it direction according to the rod and movement direction
    if (ballMovement.movement === 0) {
      ballMovement.movement = 1;
      ballMovement.right = 1;
      if (ballMovement.start === 1) ballMovement.up = 1;
      else ballMovement.down = 1;
    }
  }
});

// This function will move the ball
// In this function, 2 functions are also being called which takes care of collisions
// The 2 collisions are -> collision-with-wall and collision-with-rod
function moveBall() {
  if (ballMovement.movement === 0) {
    return;
  }

  // If the ball is going to collide then then these functions will change the direction of ball
  collisionWithWall();
  collisionWithRod();

  // The next few lines of code will move the ball in the direction it is supposed to move
  // if the ball was going to collide, its direction would have been already changed by the previous function
  if (ballMovement.left) {
    ball.style.left = ball.offsetLeft - BALL_MOVEMENT + "px";
  } else if (ballMovement.right) {
    ball.style.left = ball.offsetLeft + BALL_MOVEMENT + "px";
  }

  if (ballMovement.up) {
    ball.style.top = ball.offsetTop - BALL_MOVEMENT + "px";
  } else {
    ball.style.top = ball.offsetTop + BALL_MOVEMENT + "px";
  }

  // this function will check if the ball can move in x-axis without collision or not
  // in case of collision with a wall, it will change its direction
  function collisionWithWall() {
    let ballPos = ball.getBoundingClientRect();
    if (ballPos.left - BALL_MOVEMENT < boardPos.left) {
      ballMovement.left = 0;
      ballMovement.right = 1;
    } else if (ballPos.right + BALL_MOVEMENT > boardPos.right) {
      ballMovement.left = 1;
      ballMovement.right = 0;
    }
  }

  // this function will check if the ball can move in y-axis without collision or not
  // in case of collision with a rod, it will change its direction
  function collisionWithRod() {
    let ballPos = ball.getBoundingClientRect();
    let mid = (ballPos.left + ballPos.right) / 2;
    if (ballMovement.up === 1) {
      let rodPos = rod1.getBoundingClientRect();
      if (
        mid >= rodPos.left &&
        mid <= rodPos.right &&
        ballPos.top >= rodPos.bottom &&
        ballPos.top - BALL_MOVEMENT < rodPos.bottom
      ) {
        ballMovement.up = 0;
        ballMovement.down = 1;
      }
    } else {
      let rodPos = rod2.getBoundingClientRect();
      if (
        mid >= rodPos.left &&
        mid <= rodPos.right &&
        ballPos.bottom < rodPos.top &&
        ballPos.bottom + BALL_MOVEMENT > rodPos.top
      ) {
        ballMovement.up = 1;
        ballMovement.down = 0;
      }
    }
  }
}

// This function will check if a point has been scored or not
// If a point is being scored then it will alert it
// And then it will call the reset function which will bring the rods and ball to center
function roundOver() {
  let ballPos = ball.getBoundingClientRect();
  let winner;
  // we are just checking if the ball goes out of boundary then it means a goal has been scored
  if (ballPos.top <= boardPos.top) {
    winner = "rod2";
    score2++;
    if (score2 > highestScore) highestScore = score2;
  } else if (ballPos.bottom >= boardPos.bottom) {
    winner = "rod1";
    score1++;
    if (score1 > highestScore) highestScore = score1;
  }

  if (winner) {
    alert(winner + " has scored a point.");
    alert(
      "The current score is\nRod1 -> " +
        score1 +
        "\nRod2 -> " +
        score2 +
        "\nHighest score till now is " +
        highestScore
    );
    localStorage.setItem("highest-score", highestScore);
    resetGame(winner);
  }
}

// This function will bring the rods and ball to center
function resetGame(lastWinner) {
  // here we are removing the properties (which were created while playing the game)
  rod1.style.removeProperty("left");
  rod2.style.removeProperty("left");
  ball.style.removeProperty("left");
  ball.style.removeProperty("top");

  // here we are reseting the values back to default
  ballMovement.movement = 0;
  ballMovement.up = 0;
  ballMovement.left = 0;
  ballMovement.right = 0;
  ballMovement.down = 0;

  // we will decide the starting position of ball on the basis of the winner
  ballMovement.start = lastWinner === "rod1" ? 1 : 0;
  if (ballMovement.start === 0) {
    let rodPos = rod1.getBoundingClientRect();
    ball.style.top = rodPos.bottom - boardPos.top + "px";
  }
}
