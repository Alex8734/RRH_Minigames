import {SpaceShip} from "./spaceshuttle.js";

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 500;

const ship = new SpaceShip();

ship.image.onload = () => {
    gameLoop();
};

let lastTime = 0;

function gameLoop() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastTime);
    lastTime = currentTime;

    if (keysPressed["w"]) {
        ship.moveUp(deltaTime);
    }
    if (keysPressed["s"]) {
        ship.moveDown(deltaTime);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship.draw();
    console.log(ship.pos);
    requestAnimationFrame(gameLoop);
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
