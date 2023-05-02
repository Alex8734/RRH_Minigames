import { ChessClient} from "./server-client.js";

async function init(){
    const game = new Game()
    await game.client.syncMove (4,"RH7A8",
            _ => {alert("added move successfully")}, 
            _ => {alert("error, not added!")})
    
}

$(async function () {
    await init()
})

class Game{
    constructor()
    {
        this.client = new ChessClient()
    }
}