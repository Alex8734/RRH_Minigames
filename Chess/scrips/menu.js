import {HttpClient} from "../../Script/ServerClient.js";
import {game} from "./main.js"

let play = document.getElementById("play");
let client = new HttpClient();

play.addEventListener('click', function(event) {

    window.location.href = 'game.html';

    return false;
});