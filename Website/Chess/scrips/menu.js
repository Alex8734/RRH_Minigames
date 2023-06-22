import {HttpClient} from "../../Script/ServerClient.js";

const client = new HttpClient();

$(function (){
    let play = document.getElementById("play");
    let play1 = document.getElementById("play-1");
    let queue = document.getElementById("queue");
    let account = document.getElementById("account");
    let home = document.getElementById("main-menu");
    
    
    let currentGameId = "Queueing";

    home.addEventListener('click', async function ()
    {
        window.location.href = "../index.html"
    })
    
    window.addEventListener("unload",async()=>{
        await client.dequeue("Chess");
    })
    
    play.addEventListener('click', async function (event) {
        
        if (home.disabled === true)
        {
            play1.classList.remove("d-none");
            queue.classList.add("d-none");
            home.disabled = false;
            account.disabled = false;
            await client.dequeue("Chess")
            return;
        }
        play1.classList.add("d-none");
        queue.classList.remove("d-none");
        home.disabled = true;
        account.disabled = true;
        currentGameId = (await client.queue("Chess")).value;
        
        if (currentGameId.split("-").length > 2)
        {
            window.location.href = `game.html?gid=${currentGameId}`;
        }

        while (currentGameId.split("-").length < 2 && home.disabled === true)
        {
            await client.getGameID((r) =>
            {
                if (r.value.split("-").length > 2)
                {
                    window.location.href = `game.html?gid=${r.value}`;
                }
                currentGameId = r.value;
            });
            console.log(currentGameId);
        }

        return;
    });
});