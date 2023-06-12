import {SpaceShip} from "./player.js";
import {Car} from "./car.js";

let car;
let lastTime = 0;
let score = 0;
let cars = [];
let speedMultiplier = 1;
let btn;
export let canvas;
export let ctx;

let bg1;
let bg2;
let bg3;

let keysPressed = {};
let lines;
export function init ()
{
    cars = [];
    speedMultiplier = 1;
    lastTime = 0;
    score = 0;
    canvas.height = 2250;
    canvas.width = 4000;
    console.log(canvas.width);
    console.log(canvas.height);
    lines = [canvas.height / 4.5, canvas.height / 2.8125, canvas.height / 1.99625, canvas.height / 1.6];
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
    gameLoop();
}
function gameLoop() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastTime);
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    DrawAndMoveBackground();

    if (keysPressed["w"]) {
        car.moveUp(deltaTime);
    }
    if (keysPressed["s"]) {
        car.moveDown(deltaTime);
    }

    createCars(speedMultiplier);

    car.draw();
    drawCarsAndMove(deltaTime, speedMultiplier);
    printUI(score);
    if (!checkColiding(car))
    {
        if (keysPressed["d"] && speedMultiplier < 3)
        {
            speedMultiplier += (0.00025 * deltaTime);
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

        requestAnimationFrame(gameLoop);
    }
    else
    {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.fillStyle = "red";
        ctx.font = `${canvas.width / 6.25}px Comic Sans MS`;
        ctx.textAlign = "center";
        ctx.fillText('Game Over', canvas.width/2, canvas.height/2);
        ctx.restore();
        ctx.save();
        ctx.font = `${canvas.width / 16}px Comic Sans MS`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`Your score was: ${score}`, canvas.width/2, canvas.height/2 + canvas.width / 12.5);
        ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', (event) =>{
    btn = document.getElementById('play-again');
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    init();
});


function printUI(score)
{
    ctx.save();
    ctx.font = `${canvas.width / 16}px Comic Sans MS`;
    ctx.fillStyle = "white";
    ctx.fillText(`${score.toString()}`, 0 ,canvas.width / 19);
    ctx.restore();
}

function drawCarsAndMove(deltatime, speedMultiplier)
{
    let cnt = 0;
    for (let i = 0; i < cars.length; i++)
    {
        cars[i].drive(deltatime, speedMultiplier);
        cars[i].draw();

        if (cars[i].pos.x < (-cars[i].size.x))
        {
            cnt++;
            score++;
            cars.splice(i, 1);
            i--;
        }
    }

    //cars.splice(0, cnt);
}

function DrawAndMoveBackground()
{
    bg1.pos.x -= (canvas.height / 250) + speedMultiplier * 20;
    bg2.pos.x -= (canvas.height / 250) + speedMultiplier * 20;
    bg3.pos.x -= (canvas.height / 250) + speedMultiplier * 20;

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
function createCars(timeMultiplier){
    let randomNumber = Math.floor((Math.random() * Math.round(20)) + 1);

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
        if (checkSquareCollision(cars[i].pos.x, cars[i].pos.y, canvas.width, spawnY, cars[i].size.x))
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
        if (checkSquareCollision(car.pos.x, car.pos.y, cars[i].pos.x, cars[i].pos.y, car.size.x))
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