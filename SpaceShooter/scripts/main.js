import {SpaceShip} from "./spaceshuttle.js";

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

    ship.draw();
    console.log(ship.pos);
    requestAnimationFrame(gameLoop);
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

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

let keysPressed = {};

function handleKeyDown(event) {
    keysPressed[event.key] = true;
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}
