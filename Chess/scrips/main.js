export const canvas = document.getElementById("canvas");
export const context = canvas.getContext("2d");

import {Piece} from "./chess.js";
import {Game} from "./chess.js";
import {ServerClient} from "../../server/server-client";

export let game;

let standardName = "Unknown User";

async function init() {
    game = new Game(800, 0, 1);
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

    let row = Math.floor(y / 100);
    let col = Math.floor(x / 100);
    console.log(col, row);
    game.clickOn(col, row);
});
