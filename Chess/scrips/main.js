export const canvas = document.getElementById("canvas");
export const context = canvas.getContext("2d");

import {Game} from "./chess.js";

export let game;
document.addEventListener('click', function(event) {
    let clickX = event.x;
    let clickY = event.y;
});

async function init() {
    game = new Game(600);
    game.init();
}
$(async function () {
    await init()
})

canvas.addEventListener('click', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    // x and y are now relative to the canvas

    let row = Math.floor(y / 75);
    let col = Math.floor(x / 75);
    console.log(col, row);
    game.clickOn(col, row);
});
