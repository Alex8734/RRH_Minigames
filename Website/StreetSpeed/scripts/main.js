import {SpaceShip} from "./player.js";
import {Car} from "./car.js";
import {HttpClient} from "../../Script/ServerClient.js";

const httpClient = new HttpClient();
let car;
let lastTime = 0;
let money = 0;
let cars = [];
let speedMultiplier = 1;
let deleteCooldown = 0;
export let canvas;
export let ctx;
let moneyStatus = document.getElementById('money');
let bg1;
let bg2;
let bg3;
let gameId;
let playButton = document.getElementById('play-again');
let changeButton = document.getElementById('change-car');
let keysPressed = {};
let lines;

export async function init ()
{
    gameId = (await httpClient.startSoloGame("CarRacing")).value;
    cars = [];
    speedMultiplier = 1;
    lastTime = 0;
    money = 0;
    canvas.height = 800;
    canvas.width = 1422;
    //canvas.style.height = Math.floor(canvas.clientHeight * window.devicePixelRatio) / 1.2 + 'px';
    //canvas.style.width = Math.floor(canvas.clientWidth * window.devicePixelRatio) / 1.2 + 'px';
    console.log(canvas.width);
    console.log(canvas.height);
    lines = [canvas.height / 4.5, canvas.height / 2.8125, canvas.height / 1.99625, canvas.height / 1.55];
    car = new SpaceShip();
    bg1 = new Image();
    bg1.src = "./images/street2.png";
    bg1.size = {x: canvas.height, y: canvas.height};
    bg2 = new Image();
    bg2.src = "./images/street2.png";
    bg2.size = {x: canvas.height, y: canvas.height};
    bg1.pos = {x: 0, y: 0};
    bg2.pos = {x: bg1.size.x, y: 0};
    bg3 = new Image();
    bg3.src = "./images/street2.png";
    bg3.size = {x: canvas.height, y: canvas.height};
    bg3.pos = {x: (bg2.pos.x + bg2.size.x), y: 0};
    await gameLoop();
}

const targetFrameTime = 1000 / 60; // 60Hz target refresh rate
let gameStopped = false;
async function gameLoop(currentTime) {
    let deltaTime = currentTime - lastTime;
    
    if (deltaTime >= targetFrameTime) {
        const scalingFactor = canvas.width / 2000;

        // Adjust the deltaTime based on the scaling factor
        deltaTime *= scalingFactor;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        DrawAndMoveBackground(deltaTime);

        if (keysPressed["w"]) {
            car.moveUp(deltaTime);
        }
        if (keysPressed["s"]) {
            car.moveDown(deltaTime);
        }

        createCars();

        car.draw();
        drawCarsAndMove(deltaTime, speedMultiplier);
        printUI(money);

        if (!checkColiding(car))
        {
            if (keysPressed["d"] && speedMultiplier < 3)
            {
                speedMultiplier += (0.00025 * deltaTime);
                deleteCooldown++;
            }
            else
            {
                speedMultiplier -= (0.00025 * deltaTime);
                if (speedMultiplier < 1)
                {
                    speedMultiplier = 1;
                }
                else if(keysPressed["a"])
                {
                    speedMultiplier -= (0.00075 * deltaTime);
                }
            }

            moneyStatus.textContent = '$ ' + money;
            requestAnimationFrame(gameLoop);
        }
        else
        {
            gameStopped = true;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            playButton.style.display = 'block';

            ctx.fillStyle = "red";
            ctx.font = `${canvas.width / 6.25}px Comic Sans MS`;
            ctx.textAlign = "center";
            ctx.fillText('Game Over', canvas.width/2, canvas.height/2);
            ctx.restore();
            ctx.save();
            ctx.font = `${canvas.width / 16}px Comic Sans MS`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`You collected ${money}$`, canvas.width/2, canvas.height/2 + canvas.width / 12.5);
            ctx.restore();
            //changeButton.style.display = 'block';
            await httpClient.endSoloGame(gameId, money, "CarRacing");
        }
        lastTime = currentTime - (deltaTime % targetFrameTime);
    }
    if (!gameStopped)
    {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('DOMContentLoaded', async (event) =>{
    playButton = document.getElementById('play-again');
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    await init();
});


function printUI(money)
{

}

function drawCarsAndMove(deltatime, speedMultiplier)
{
    if(deleteCooldown > 100)
    {
        for (let i = 0; i < cars.length; i++)
        {
            cars[i].drive(deltatime, speedMultiplier);
            cars[i].draw();

            if (cars[i].pos.x < (-cars[i].size.x))
            {
                money++;
                cars.splice(i, 1);
                i--;
            }
        }
    }
    else{
        deleteCooldown++;
    }
}

function DrawAndMoveBackground(deltaTime)
{
    bg1.pos.x -= (canvas.height / 250) + speedMultiplier * (deltaTime / 3) * 2;
    bg2.pos.x -= (canvas.height / 250) + speedMultiplier * (deltaTime / 3) * 2;
    bg3.pos.x -= (canvas.height / 250) + speedMultiplier * (deltaTime / 3) * 2;

    if (bg1.pos.x <= -bg1.size.x) {
        bg1.pos.x = bg3.pos.x + bg3.size.x;
    }
    if (bg2.pos.x <= -bg2.size.x) {
        bg2.pos.x = bg1.pos.x + bg1.size.x;
    }
    if (bg3.pos.x <= -bg3.size.x) {
        bg3.pos.x = bg2.pos.x + bg2.size.x;
    }

    ctx.drawImage(bg1, bg1.pos.x, bg1.pos.y, bg1.size.x, bg1.size.y);
    ctx.drawImage(bg2, bg2.pos.x, bg2.pos.y, bg2.size.x, bg2.size.y);
    ctx.drawImage(bg3, bg3.pos.x, bg3.pos.y, bg3.size.x, bg3.size.y);
}
function createCars(){
    let randomNumber = Math.floor((Math.random() * 30) + 1);

    if (randomNumber === 1)
    {
        randomNumber = Math.floor((Math.random() * 4));

        while(!checkForValidSpawn(lines[randomNumber]))
        {
            randomNumber = Math.floor((Math.random() * 4));
        }

        cars.push(new Car(canvas.width, lines[randomNumber]))
        return;
    }
}

function checkForValidSpawn(spawnY)
{
    for (let i = 0; i < cars.length; i++)
    {
        if (checkSquareCollision(cars[i].pos.x, cars[i].pos.y, canvas.width, spawnY, cars[i].size.x + 20))
        {
            return false;
        }
    }

    return true;
}

function handleKeyDown(event) {
    keysPressed[event.key] = true;
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

function checkColiding(car)
{
    for (let i = 0; i < cars.length; i++)
    {
        if (checkSquareCollision(car.pos.x, car.pos.y, cars[i].pos.x, cars[i].pos.y, car.size.x - 50))
        {
            return true;
        }
    }

    return false;
}

function checkSquareCollision(x1, y1, x2, y2, side) {
    const distX = Math.abs((x1 + side / 2) - (x2 + side / 2));
    const distY = Math.abs((y1 + side / 2) - (y2 + side / 2));
    const halfSide = side / 2;

    if (distX <= halfSide && distY <= halfSide) {
        return true;
    }
    return false;
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

playButton.addEventListener('click', async () => {
    playButton.style.display = 'none';
    //changeButton.style.display = 'none';
    gameStopped = false;
    await init();
});

document.getElementById('back-to-home').addEventListener('click', function() {
    window.location.href = '../index.html';
});