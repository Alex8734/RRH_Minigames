import {HttpClient} from "../../Script/ServerClient.js";
import {game} from "./main.js"

const client = new HttpClient();

$(function (){
    let play = document.getElementById("play");
    let play1 = document.getElementById("play-1");
    let queue = document.getElementById("queue");

    let currentGameId = "Queueing";

    play.addEventListener('click', async function (event) {
        play1.classList.add("d-none");
        queue.classList.remove("d-none");

        await client.queue("Chess");

        while(currentGameId === 'Queueing')
        {
            currentGameId = await client.getGameID();
            currentGameId = currentGameId.value;
            console.log(currentGameId);
        }

        window.location.href = `game.html?gid=${currentGameId}`;

        return false;
    });
});