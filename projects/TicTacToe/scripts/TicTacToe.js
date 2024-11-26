const cells = document.querySelectorAll(".cell");
const restartButton = document.getElementById("restartBtn");

const turnIndicator = document.createElement("div");
turnIndicator.classList.add("turn-indicator");
turnIndicator.innerHTML = `Player <span class="player-x">X</span>'s turn`;
document.body.appendChild(turnIndicator);

let currentPlayer = "X";
let gameActive = true;
let gameState = Array(9).fill(null);

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

updateTurnIndicator();

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index), { once: true });
});

function handleCellClick(cell, index) {
    if (!gameActive) return;

    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === "X" ? "#ff5c5c" : "#5c85ff";
    gameState[index] = currentPlayer;

    if (checkWin()) {
        endGame(false);
    } else if (gameState.every((cell) => cell)) {
        endGame(true);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateTurnIndicator();
    }
}

function checkWin() {
    return winningCombinations.some((combination) => {
        const [a, b, c] = combination;
        return (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        );
    });
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        turnIndicator.innerHTML = "It's a draw!";
    } else {
        turnIndicator.innerHTML = `Player <span class="${currentPlayer === "X" ? "player-x" : "player-o"
            }">${currentPlayer}</span> wins!`;
    }
}

function updateTurnIndicator() {
    turnIndicator.innerHTML = `Player <span class="${currentPlayer === "X" ? "player-x" : "player-o"
        }">${currentPlayer}</span>'s turn`;
}

restartButton.addEventListener("click", () => {
    gameActive = true;
    currentPlayer = "X";
    gameState.fill(null);
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("winning");
        cell.addEventListener(
            "click",
            () => handleCellClick(cell, [...cells].indexOf(cell)),
            { once: true }
        );
    });
    updateTurnIndicator();
});
