import {SpaceShip} from "./spaceshuttle.js";

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

const ship = new SpaceShip();

ship.image.onload = () => {
    gameLoop();
};

let lastTime = 0;

function gameLoop() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (keysPressed["w"]) {
        ship.moveUp();
    }
    if (keysPressed["s"]) {
        ship.moveDown();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship.draw();
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
