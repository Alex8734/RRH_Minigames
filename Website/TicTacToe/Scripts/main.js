import {HttpClient} from "../../Script/ServerClient.js";

const symbol = Object.freeze({
    X: "X",
    O: "O",
    Empty: "Empty"
});

const gameStatus = Object.freeze({
    PlayerWon: "PlayerWon",
    EnemyWon: "EnemyWon",
    Draw: "Draw",
    Running: "Running",
    NoGame: "NoGame"
});

const httPClient = new HttpClient();
let canvas;
let ctx;
let currentGameId = "Queueing";
let currentState = [[symbol.Empty, symbol.Empty, symbol.Empty], [symbol.Empty, symbol.Empty, symbol.Empty], [symbol.Empty, symbol.Empty, symbol.Empty]];
let playerSymbol = symbol.X;
let enemySymbol = symbol.O;
let status = gameStatus.NoGame;

document.addEventListener('DOMContentLoaded', (event) =>{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = 1500;
    canvas.width = 1500;
    //canvas.style.height = Math.floor(canvas.clientHeight * window.devicePixelRatio) / 1.2 + 'px';
    //canvas.style.width = Math.floor(canvas.clientWidth * window.devicePixelRatio) / 1.2 + 'px';
    init();
});

async function init()
{
    await httPClient.queue("TicTacToe");

    while(currentGameId === 'Queueing')
    {
        currentGameId = await httPClient.getGameID();
        currentGameId = currentGameId.value;
        console.log(currentGameId);
    }

    let response = await httPClient.getPlayers(currentGameId);
    

    status = gameStatus.Running;
    drawGame();
    await gameLoop();
}

async function gameLoop()
{
    if (playerSymbol == symbol.X)
    {
        while(status == gameStatus.Running)
        {
            let click = await getClick();
            updateState(click, playerSymbol);
            await httPClient.postLastMove(currentGameId, click);
            checkForGameFinished();

            let json = "";

            while(json === "")
            {
                json = await httPClient.getLastMove(currentGameId).value;
            }
            updateState(json, enemySymbol);
            checkForGameFinished();
        }
    }
    else {
        while(status == gameStatus.Running)
        {
            let json = "";

            while(json.value === "")
            {
                json.value = await httPClient.getLastMove(currentGameId);
            }
            updateState(json, enemySymbol);
            checkForGameFinished();

            let click = await getClick();
            updateState(click, playerSymbol);
            await httPClient.postLastMove(currentGameId, click);
            checkForGameFinished();
        }
    }
}

function getClick() {
    return new Promise((resolve) => {
        canvas.addEventListener("click", handleCanvasClick);

        function handleCanvasClick(event) {
            const x = event.clientX;
            const y = event.clientY;

            const row = Math.floor(y / (canvas.height / 3));
            const col = Math.floor(x / (canvas.width / 3));

            canvas.removeEventListener("click", handleCanvasClick);

            resolve(`${row}:${col}`);
        }
    });
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    for (let col = 1; col < 3; col++) {
        const x = (canvas.width / 3) * col;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    for (let row = 1; row < 3; row++) {
        const y = (canvas.height / 3) * row;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}

function checkForGameFinished()
{
    for (let row = 0; row < 3; row++) {
        if (
            currentState[row][0] != symbol.Empty &&
            currentState[row][0] == currentState[row][1] &&
            currentState[row][1] == currentState[row][2]
        ) {
            status = currentState[row][0] == playerSymbol ? gameStatus.PlayerWon : gameStatus.EnemyWon;
            return;
        }
    }

    for (let col = 0; col < 3; col++) {
        if (
            currentState[0][col] != symbol.Empty &&
            currentState[0][col] == currentState[1][col] &&
            currentState[1][col] == currentState[2][col]
        ) {
            status = currentState[0][col] == playerSymbol ? gameStatus.PlayerWon : gameStatus.EnemyWon;
            return;
        }
    }

    if (
        currentState[0][0] != symbol.Empty &&
        currentState[0][0] == currentState[1][1] &&
        currentState[1][1] == currentState[2][2]
    ) {
        status = currentState[0][0] == playerSymbol ? gameStatus.PlayerWon : gameStatus.EnemyWon;
        return;
    }

    if (
        currentState[0][2] != symbol.Empty &&
        currentState[0][2] == currentState[1][1] &&
        currentState[1][1] == currentState[2][0]
    ) {
        status = currentState[0][2] == playerSymbol ? gameStatus.PlayerWon : gameStatus.EnemyWon;
        return;
    }
}

function updateState(coordinates, symbol) {
    const [row, col] = coordinates.split(":").map(Number);
    currentState[row][col] = symbol;
    drawSymbol(symbol, row, col);
}

function drawSymbol(symbol, row, col) {
    const cellWidth = canvas.width / 3;
    const cellHeight = canvas.height / 3;

    const centerX = cellWidth * col + cellWidth / 2;
    const centerY = cellHeight * row + cellHeight / 2;

    ctx.font = `${cellWidth / 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const symbolColor = symbol === symbol.X ? 'blue' : 'red';

    ctx.fillStyle = symbolColor;
    ctx.fillText(symbol, centerX, centerY);
}


