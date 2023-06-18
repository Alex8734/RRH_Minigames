import {HttpClient} from "../../Script/ServerClient";
import {game} from "../../Chess/scrips/main";

const httPClient = new HttpClient();
let canvas;
let ctx;
let currentGameId = "queueing";
let currentState = [[symbol.Empty, symbol.Empty, symbol.Empty][symbol.Empty, symbol.Empty, symbol.Empty][symbol.Empty, symbol.Empty, symbol.Empty]];
let playerSymbol = symbol.X;
let enemySymbol = symbol.O;
let status = gameStatus.NoGame;

document.addEventListener('DOMContentLoaded', (event) =>{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = 1500;
    canvas.width = 1500;
    canvas.style.height = Math.floor(canvas.clientHeight * window.devicePixelRatio) / 1.2 + 'px';
    canvas.style.width = Math.floor(canvas.clientWidth * window.devicePixelRatio) / 1.2 + 'px';
    init();
});

async function init()
{
    await httPClient.queue("TicTacToe");

    while(currentGameId == "queueing")
    {
        currentGameId = httPClient.getGameID();
        status = gameStatus.Running;
    }

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
            await httPClient.pushMove(currentGameId, click);
            updateState(click, enemySymbol);
            checkForGameFinished();

            let json = await httPClient.getLastMove(currentGameId);
            updateState(json, enemySymbol);
            checkForGameFinished();
        }
    }
    else {
        while(status == gameStatus.Running)
        {
            let json = await httPClient.getLastMove(currentGameId);
            updateState(json, enemySymbol);
            checkForGameFinished();

            let click = await getClick();
            await httPClient.pushMove(currentGameId, click);
            updateState(click, enemySymbol);
            checkForGameFinished();
        }
    }
}

function getClick() {
    return new Promise((resolve) => {
        canvas.addEventListener("click", handleCanvasClick);

        function handleCanvasClick(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

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

}

function updateState(coordinates, symbol)
{

}

function drawSymbol(symbol)
{

}

const symbol = Object.freeze({
    X: "X",
    O: "O",
    Empty: "Empty"
})

const gameStatus = Object.freeze({
    X: "X",
    O: "O",
    Draw: "Draw",
    Running: "Running",
    NoGame: "NoGame"
})


