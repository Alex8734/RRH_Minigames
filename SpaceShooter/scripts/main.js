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

ship.image.onload = () => {
    bg1.onload = () => {
        bg2.onload = () => {
            gameLoop();
        }
    }
};
let lastTime = 0;

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
    requestAnimationFrame(gameLoop);
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
    let randomNumber = Math.floor(Math.random() * 10) + 1;

    if(metorites.length > 1 && metorites[0].pos.x < -10)
    {
        metorites[0] = metorites[1];
    }

    if (randomNumber === 1)
    {
        randomNumber = Math.floor((Math.random() * ((-600) - 200)) + 200)
        metorites.push(new Meteor(500, randomNumber))
        return;
    }
}

let keysPressed = {};

function handleKeyDown(event) {
    keysPressed[event.key] = true;
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);