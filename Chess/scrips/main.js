import {Game} from "./chess.js";

export let game;

const canvas = document.getElementById("canvas");

export const ctx = canvas.getContext("2d")

let standardName = "Unknown User";
let myclr = "black";
async function init() {
    game = new Game(560, 0, 1, standardName, standardName, myclr, ctx, 0);
    await game.init();

    await game.gameLoop();
}
$(async function () {
    await init()
})

canvas.addEventListener('click', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    // x and y are now relative to the canvas

    let row = Math.floor(y / 70);
    let col = Math.floor(x / 70);
    console.log(7 - col, 7 - row);
    game.clickOn(7 - col, 7 - row);
});

