export const canvas = document.getElementById("canvas");
export const context = canvas.getContext("2d");

import {Game} from "./chess.js";

document.addEventListener('click', function(event) {
    let clickX = event.x;
    let clickY = event.y;
});

async function init() {
    let game = new Game(600);
    game.init();
}
$(async function () {
    await init()
})
