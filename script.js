const cells = document.querySelectorAll(".cell");

const turnText = document.getElementById("turnText");
const resultMessage = document.getElementById("resultMessage");

const newGameBtn = document.getElementById("newGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const scoreDrawElement = document.getElementById("scoreDraw");

const modeButtons = document.querySelectorAll(".mode-btn");


/* Game */

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "computer";

let scores = {
    X: 0,
    O: 0,
    draw: 0
};


/* Winning combinations */

const winningPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


/* Cell click */

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index = Number(cell.dataset.index);

        // Don't allow moves after game ends
        if (!gameActive) {
            return;
        }

        // Don't allow clicking an occupied cell
        if (board[index] !== "") {
            return;
        }

        // Computer controls O
        if (
            gameMode === "computer" &&
            currentPlayer === "O"
        ) {
            return;
        }

        // Make player's move
        makeMove(index, currentPlayer);

        // Stop if someone won or game is draw
        if (!gameActive) {
            return;
        }


        /* PLAYER VS COMPUTER */

        if (gameMode === "computer") {

            currentPlayer = "O";

            updateTurn();

            setTimeout(computerMove, 450);

        }


        /* PLAYER VS PLAYER */

        else {

            // Switch X → O
            // Switch O → X
            currentPlayer =
                currentPlayer === "X"
                    ? "O"
                    : "X";

            updateTurn();

        }

    });

});

/* Make Move */

function makeMove(index, player) {

    board[index] = player;

    const cell = cells[index];

    cell.textContent = player;

    cell.classList.add(
        player.toLowerCase()
    );

    checkGame();

}


/* Check Game */

function checkGame() {

    const winner = getWinner();

    if (winner) {

        gameActive = false;

        scores[winner.player]++;

        updateScores();

        winner.pattern.forEach(index => {

            cells[index].classList.add(
                "winner"
            );

        });

        resultMessage.textContent =
            `${winner.player} wins! 🎉`;

        turnText.textContent =
            "Game Over";

        return;
    }


    /* Draw */

    if (!board.includes("")) {

        gameActive = false;

        scores.draw++;

        updateScores();

        resultMessage.textContent =
            "It's a draw! 🤝";

        turnText.textContent =
            "Game Over";

        return;
    }

}


/* Winner */

function getWinner() {

    for (
        const pattern of winningPatterns
    ) {

        const [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                player: board[a],
                pattern: pattern
            };

        }

    }

    return null;
}


/* Computer */

function computerMove() {

    if (!gameActive) {
        return;
    }

    if (gameMode !== "computer") {
        return;
    }

    /* Try to win */

    let move = findBestMove("O");

    /* Block player */

    if (move === -1) {
        move = findBestMove("X");
    }

    /* Take center */

    if (
        move === -1 &&
        board[4] === ""
    ) {
        move = 4;
    }

    /* Random corner */

    if (move === -1) {

        const corners = [
            0,
            2,
            6,
            8
        ].filter(
            index => board[index] === ""
        );

        if (corners.length > 0) {

            move =
                corners[
                    Math.floor(
                        Math.random() *
                        corners.length
                    )
                ];

        }

    }

    /* Random empty cell */

    if (move === -1) {

        const emptyCells =
            board
                .map((value, index) =>
                    value === ""
                        ? index
                        : null
                )
                .filter(
                    index => index !== null
                );

        if (emptyCells.length > 0) {

            move =
                emptyCells[
                    Math.floor(
                        Math.random() *
                        emptyCells.length
                    )
                ];

        }

    }

    if (move !== -1) {

        makeMove(move, "O");

    }

    if (gameActive) {

        currentPlayer = "X";

        updateTurn();

    }

}


/* Find winning/blocking move */

function findBestMove(player) {

    for (
        const pattern of winningPatterns
    ) {

        const values =
            pattern.map(
                index => board[index]
            );

        const playerCount =
            values.filter(
                value => value === player
            ).length;

        const emptyCount =
            values.filter(
                value => value === ""
            ).length;

        if (
            playerCount === 2 &&
            emptyCount === 1
        ) {

            return pattern.find(
                index => board[index] === ""
            );

        }

    }

    return -1;
}


/* Turn */

function updateTurn() {

    if (!gameActive) {
        return;
    }

    if (
        gameMode === "computer"
    ) {

        if (currentPlayer === "X") {

            turnText.textContent =
                "Your turn • X";

        } else {

            turnText.textContent =
                "Computer is thinking...";

        }

    } else {

        turnText.textContent =
            `Player ${currentPlayer}'s turn`;

    }

}


/* New Game */

function newGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameActive = true;

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });

    resultMessage.textContent =
        "Make your move";

    updateTurn();

}


/* Change Mode */

modeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            modeButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });

            button.classList.add(
                "active"
            );

            gameMode =
                button.dataset.mode;

            newGame();

        }
    );

});


/* Update Scores */

function updateScores() {

    scoreXElement.textContent =
        scores.X;

    scoreOElement.textContent =
        scores.O;

    scoreDrawElement.textContent =
        scores.draw;

}


/* Reset Score */

resetScoreBtn.addEventListener(
    "click",
    () => {

        scores = {
            X: 0,
            O: 0,
            draw: 0
        };

        updateScores();

        newGame();

    }
);


/* New Game */

newGameBtn.addEventListener(
    "click",
    newGame
);


/* Start */

updateTurn();