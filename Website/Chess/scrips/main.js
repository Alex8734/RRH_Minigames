import {Game} from "./chess.js";
import {HttpClient} from "../../Script/ServerClient.js";

export let game;
export let ctx;

export let canvas;

const client = new HttpClient();

let standardName = "Unknown User";
let myclr;
async function init() {

    const url = new URL(window.location.toLocaleString());
    const params = url.searchParams;
    const currentGameId = params.get("gid");

    let response = await client.getPlayers(currentGameId);
    console.log(response);
    if (response[0] === sessionStorage.getItem('user'))
    {
        myclr = "white";
    }
    else {
        myclr = "black";
    }

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    game = new Game(560, response[0], response[1], myclr, currentGameId);
    game.init();

    canvas.addEventListener('click', function(event) {

        // Get the current URL
        let currentURL = window.location.href;

        if (!(currentURL.split("?")[0].endsWith("game.html"))) {
            return;
        }

        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        // x and y are now relative to the canvas

        let row = Math.floor(y / 70);
        let col = Math.floor(x / 70);
        if (game.myclr === "white") {
            console.log(col, row);
            game.clickOn(col, row);
        }
        else {
            console.log(7-col, 7-row);
            game.clickOn(7-col, 7-row);
        }
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

    await game.gameLoop();
}
$(async function () {
    await init()
})



