const board = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("startBtn");
const countdownDisplay = document.getElementById("countdown");

let snake = [{ x: 240, y: 240 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
const boardSize = 500;
const tileSize = 20;
let gameInterval;
let gameStarted = false;

// Start Game
function startGame() {
    countdownDisplay.style.display = "block";
    let countdown = 3;
    countdownDisplay.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = "none";
            beginGame();
        }
    }, 1000);
}

function beginGame() {
    snake = [{ x: 240, y: 240 }];
    direction = { x: tileSize, y: 0 };
    score = 0;
    gameStarted = true;
    scoreDisplay.textContent = score;
    placeFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 150);
}

function placeFood() {
    food.x = Math.floor(Math.random() * (boardSize / tileSize)) * tileSize;
    food.y = Math.floor(Math.random() * (boardSize / tileSize)) * tileSize;
}

function updateGame() {
    if (!gameStarted) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= boardSize ||
        head.y >= boardSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameInterval);
        alert(`Game Over! Your score: ${score}`);
        window.location.reload();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
    renderGame();
}

function renderGame() {
    board.innerHTML = "";


    snake.forEach(segment => {
        const snakeElement = document.createElement("div");
        snakeElement.style.left = segment.x + "px";
        snakeElement.style.top = segment.y + "px";
        snakeElement.style.width = `${tileSize}px`;
        snakeElement.style.height = `${tileSize}px`;
        snakeElement.classList.add("snake");
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement("div");
    foodElement.style.left = food.x + "px";
    foodElement.style.top = food.y + "px";
    foodElement.style.width = `${tileSize}px`;
    foodElement.style.height = `${tileSize}px`;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -tileSize };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: tileSize };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -tileSize, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: tileSize, y: 0 };
            break;
    }
});

startButton.addEventListener("click", startGame);
