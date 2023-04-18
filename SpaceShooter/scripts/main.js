import {SpaceShip} from "./spaceshuttle.js";
import {Meteor} from "./meteor.js";

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 500;

let bg1 = new Image();
bg1.src = "./images/background.png";
bg1.size = {x: canvas.width, y: canvas.height};
let bg2 = new Image();
bg2.src = "./images/background.png";
bg2.size = {x: canvas.width, y: canvas.height};

bg1.pos = {x: 0, y: 0}
bg2.pos = {x: canvas.width, y: 0}

const ship = new SpaceShip();

document.addEventListener('DOMContentLoaded', (event) =>{
    gameLoop();
})

let lastTime = 0;
let score = 0;
let metorites = [];

function gameLoop() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastTime);
    lastTime = currentTime;

    console.log(bg1.pos);
    console.log(bg2.pos);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    DrawAndMoveBackground();

    if (keysPressed["w"]) {
        ship.moveUp(deltaTime);
    }
    if (keysPressed["s"]) {
        ship.moveDown(deltaTime);
    }

    createMeteorite();

    ship.draw();
    drawMeteoritesAndMove(deltaTime);
    printUI(score);
    if (!checkColiding(ship))
    {
        requestAnimationFrame(gameLoop);
    }
    else
    {
        ctx.save();
        ctx.fillStyle = "red";
        ctx.font = "80px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillText('Game Over', canvas.width/2, canvas.height/2);
        ctx.restore();
    }
}

function printUI(score)
{
    ctx.save();
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.fillText(`${score.toString()}`, 0 ,27);
    ctx.restore();
}

function drawMeteoritesAndMove(deltatime)
{
    for (let i = 0; i < metorites.length; i++)
    {
        metorites[i].fall(deltatime);
        metorites[i].draw();
    }
}

function DrawAndMoveBackground()
{
    bg1.pos.x -= 2;
    bg2.pos.x -= 2;

    if (bg1.pos.x <= -500)
    {
        bg1.pos.x = canvas.width;
    }
    if (bg2.pos.x <= -500)
    {
        bg2.pos.x = canvas.width;
    }

    ctx.drawImage(bg1, bg1.pos.x, bg1.pos.y, canvas.width, canvas.height);
    ctx.drawImage(bg2, bg2.pos.x, bg2.pos.y, canvas.width, canvas.height);
}

function createMeteorite(){
    let randomNumber = Math.floor(Math.random() * 20) + 1;

    if(metorites.length > 1 && metorites[0].pos.x < -10)
    {
        metorites[0] = metorites[1];
    }

    if (randomNumber === 1)
    {
        randomNumber = Math.floor((Math.random() * ((-500) - 200)) + 200)
        while(!checkForValidSpawn(randomNumber))
        {
            randomNumber = Math.floor((Math.random() * ((-500) - 200)) + 200)
        }
        metorites.push(new Meteor(500, randomNumber))
        return;
    }
}

function checkForValidSpawn(spawnY)
{
    for (let i = 0; i < metorites.length; i++)
    {
        if (checkSquareCollision(metorites[i].pos.x, metorites[i].pos.y, 500, spawnY, 150))
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