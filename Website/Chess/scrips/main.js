import {Game} from "./chess.js";

export let game;
export let ctx;

let standardName = "Unknown User";
let myclr = Math.floor(Math.random() * 2) === 1 ? "white" : "black";
function init() {
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    game = new Game(560, 0, 1, standardName, standardName, myclr, ctx, 0);
    game.init();

    canvas.addEventListener('click', function(event) {
        // Get the current URL
        let currentURL = window.location.href;

        if (!(currentURL.endsWith("game.html"))) {
            return;
        }

        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        // x and y are now relative to the canvas

        let row = Math.floor(y / 70);
        let col = Math.floor(x / 70);
        console.log(7 - col, 7 - row);
        game.clickOn(7 - col, 7 - row);
    });
    let main_menu = document.getElementById("main-menu");
    let abandon = document.getElementById("abandon");

    main_menu.addEventListener('click', function (event)
    {

        window.location.href = 'index.html';

        return false;
    });
    abandon.addEventListener('click', function (event)
    {

        game.gameOver = game.myclr === "white" ? "white" : "black";
    });

    //game.gameLoop();
}
$(async function () {
    await init()
})



