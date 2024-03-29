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

document.getElementById('home-page').addEventListener('click', () => {
    window.location.href = './../index.html';
});

const httPClient = new HttpClient();
let canvas;
let ctx;
let currentGameId;
let currentState;
let playerSymbol = symbol.X;
let enemySymbol = symbol.O;
let status = gameStatus.NoGame;
let enemyName = "";
const button = document.getElementById('play-again');
const statusBox = document.getElementById('status');
const loadingCircle = document.getElementById('loading-circle');
document.addEventListener('DOMContentLoaded', () =>{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = 400;
    canvas.width = 400;

    drawGame();
});

button.addEventListener('click', async () => {
    button.style.display = 'none';
    loadingCircle.style.display = 'block';
    statusBox.innerText = "Searching...";
    await init();
});

async function init()
{
    currentState = [[symbol.Empty, symbol.Empty, symbol.Empty], [symbol.Empty, symbol.Empty, symbol.Empty], [symbol.Empty, symbol.Empty, symbol.Empty]];
    currentGameId = (await httPClient.queue("TicTacToe")).value;
    
    while (currentGameId.split("-").length < 2)
    {
        await httPClient.getGameID((r) =>
        {
            if (r.value.split("-").length > 2)
            {
                currentGameId = r.value;
                console.log("game found...")
            }
            currentGameId = r.value;
        });
        console.log(currentGameId);
    }
    console.log(currentGameId);
    let response = await httPClient.getPlayers(currentGameId);
    enemyName = response.filter((e) => e !== sessionStorage.getItem('user'))[0];
    if (response[0] === sessionStorage.getItem('user'))
    {
        playerSymbol = symbol.O;
        enemySymbol = symbol.X;
    }

    status = gameStatus.Running;
    drawGame();
    await gameLoop();
}

async function gameLoop()
{
    loadingCircle.style.display = 'none';
    if (playerSymbol === symbol.X)
    {
        while(status === gameStatus.Running)
        {
            statusBox.innerText = "Its your turn! Select a field";
            let click = await getClick();
            updateState(click, playerSymbol);
            await httPClient.postLastMove(currentGameId, click);
            console.log(`posted mov... ${click}`);
            checkForGameFinished();

            if(await handleWin()){
                break;
            }

            loadingCircle.style.display = 'block';
            let json = click;
            statusBox.innerText = `Wait for the ${enemyName}'s move`;
            while(json === click)
            {
                json = (await httPClient.getLastMove(currentGameId)).value;
            }

            updateState(json, enemySymbol);
            loadingCircle.style.display = 'none';
            checkForGameFinished();
            await handleWin();
        }
    }
    else {
        let click = "";
        while(status === gameStatus.Running)
        {
            loadingCircle.style.display = 'block';
            statusBox.innerText = `Wait for the ${enemyName}'s move`;
            let json = click;

            while(json === click)
            {
                json = (await httPClient.getLastMove(currentGameId)).value;
                console.log(json);
            }

            updateState(json, enemySymbol);
            loadingCircle.style.display = 'none';
            checkForGameFinished();

            if(await handleWin()){
                break;
            }

            statusBox.innerText = "Its your turn! Select a field";
            click = await getClick();
            updateState(click, playerSymbol);
            await httPClient.postLastMove(currentGameId, click);
            checkForGameFinished();
            await handleWin();
        }
    }
}

async function handleWin()
{
    if (status === gameStatus.EnemyWon)
    {
        statusBox.innerText = `${enemyName} won. Press the button to play again`;
        button.style.display = 'block';
        await httPClient.postLastMove(currentGameId, "");
        return true;
    }
    else if(status === gameStatus.PlayerWon)
    {
        statusBox.innerText = "Congratulation, you won!  Press the button to play again";
        button.style.display = 'block';
        await httPClient.postLastMove(currentGameId, "");
        await httPClient.EndGame(currentGameId, sessionStorage.getItem('user'), (e)=>alert(e.value));
        return true;
    }

    for (let i = 0; i < currentState.length; i++)
    {
        for (let j = 0; j < currentState.length; j++)
        {
            if (currentState[i][j] === symbol.Empty)
            {
                return false;
            }
        }
    }

    statusBox.innerText = "Draw!  Press the button to play again";
    button.style.display = 'block';
    await httPClient.postLastMove(currentGameId, "");
    await httPClient.EndGame(currentGameId, "");
    return true;
}

function getClick() {
    return new Promise((resolve) => {
        canvas.addEventListener("click", handleCanvasClick);

        function handleCanvasClick(event) {
            const x = event.offsetX;
            const y = event.offsetY;

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
    ctx.shadowColor = "white";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    for (let row = 1; row < 3; row++) {
        const y = (canvas.height / 3) * row;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.shadowColor = "white";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "white";
    ctx.stroke();
}


function checkForGameFinished()
{
    for (let row = 0; row < 3; row++) {
        if (
            currentState[row][0] !== symbol.Empty &&
            currentState[row][0] === currentState[row][1] &&
            currentState[row][1] === currentState[row][2]
        ) {
            status = currentState[row][0] === playerSymbol ? gameStatus.PlayerWon : gameStatus.EnemyWon;
            return;
        }
    }

    for (let col = 0; col < 3; col++) {
        if (
            currentState[0][col] !== symbol.Empty &&
            currentState[0][col] === currentState[1][col] &&
            currentState[1][col] === currentState[2][col]
        ) {
            status = currentState[0][col] === playerSymbol ? gameStatus.PlayerWon : gameStatus.EnemyWon;
            return;
        }
    }

    if (
        currentState[0][0] !== symbol.Empty &&
        currentState[0][0] === currentState[1][1] &&
        currentState[1][1] === currentState[2][2]
    ) {
        status = currentState[0][0] === playerSymbol ? gameStatus.PlayerWon : gameStatus.EnemyWon;
        return;
    }

    if (
        currentState[0][2] !== symbol.Empty &&
        currentState[0][2] === currentState[1][1] &&
        currentState[1][1] === currentState[2][0]
    ) {
        status = currentState[0][2] === playerSymbol ? gameStatus.PlayerWon : gameStatus.EnemyWon;
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

    ctx.fillStyle = 'white';
    ctx.fillText(symbol, centerX, centerY);
}


