import {SpaceShip} from "./spaceshuttle.js";
import {Meteor} from "./meteor.js";

let ship;
let lastTime = 0;
let score = 0;
let metorites = [];
let TimeMultiplier = 1;

export let canvas;
export let ctx;

let bg1;
let bg2;

//document.addEventListener('DOMContentLoaded', (event) =>{
//    init();
//});

export function init ()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = 5000;
    canvas.width = 5000;

    console.log(canvas.width);
    console.log(canvas.height);
    ship = new SpaceShip();
    bg1 = new Image();
    bg1.src = "./images/background.png";
    bg1.size = {x: canvas.width, y: canvas.height};
    bg2 = new Image();
    bg2.src = "./images/background.png";
    bg2.size = {x: canvas.width, y: canvas.height};
    bg1.pos = {x: 0, y: 0}
    bg2.pos = {x: canvas.width, y: 0}
    gameLoop();
}
function gameLoop() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastTime);
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    DrawAndMoveBackground();

    if (keysPressed["w"]) {
        ship.moveUp(deltaTime);
    }
    if (keysPressed["s"]) {
        ship.moveDown(deltaTime);
    }

    createMeteorite(TimeMultiplier);

    ship.draw();
    drawMeteoritesAndMove(deltaTime, TimeMultiplier);
    printUI(score);
    if (!checkColiding(ship))
    {
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

    TimeMultiplier += 0.00001 * deltaTime;
}

function printUI(score)
{
    ctx.save();
    ctx.font = `${canvas.width / 16}px Comic Sans MS`;
    ctx.fillStyle = "white";
    ctx.fillText(`${score.toString()}`, 0 ,canvas.width / 19);
    ctx.restore();
}

function drawMeteoritesAndMove(deltatime, timeMultiplier)
{
    let cnt = 0;
    for (let i = 0; i < metorites.length; i++)
    {
        metorites[i].fall(deltatime, timeMultiplier);
        metorites[i].draw();

        if (metorites[i].pos.x < -canvas.width/10)
        {
            cnt++;
            score++;
        }
    }

    metorites.splice(0, cnt);
}

function DrawAndMoveBackground()
{
    bg1.pos.x -= canvas.width / 250;
    bg2.pos.x -= canvas.width / 250;

    if (bg1.pos.x <= -canvas.width) {
        bg1.pos.x = bg2.pos.x + bg2.size.x;
    }
    if (bg2.pos.x <= -canvas.width) {
        bg2.pos.x = bg1.pos.x + bg1.size.x;
    }

    ctx.drawImage(bg1, bg1.pos.x, bg1.pos.y, bg1.size.x, bg1.size.y);
    ctx.drawImage(bg2, bg2.pos.x, bg2.pos.y, bg2.size.x, bg2.size.y);
}


function createMeteorite(timeMultiplier){
    let randomNumber = Math.floor((Math.random() * Math.round(20 / timeMultiplier)) + 1);

    if (randomNumber === 1)
    {
        randomNumber = Math.floor((Math.random() * ((-canvas.width) - (canvas.width / 2.5))) + (canvas.width / 2.5))

        while(!checkForValidSpawn(randomNumber))
        {
            randomNumber = Math.floor((Math.random() * ((-canvas.width) - (canvas.width / 2.5))) + (canvas.width / 2.5))
        }

        metorites.push(new Meteor(canvas.width, randomNumber))
        return;
    }
}

function checkForValidSpawn(spawnY)
{
    for (let i = 0; i < metorites.length; i++)
    {
        if (checkSquareCollision(metorites[i].pos.x, metorites[i].pos.y, canvas.width, spawnY, canvas.width / 3))
        {
            return false;
        }
    }

    return true;
}

let keysPressed = {};

function handleKeyDown(event) {
    keysPressed[event.key] = true;
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

function checkColiding(spaceship)
{
    for (let i = 0; i < metorites.length; i++)
    {
        if (checkSquareCollision(spaceship.pos.x, spaceship.pos.y, metorites[i].pos.x, metorites[i].pos.y, spaceship.size.x))
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