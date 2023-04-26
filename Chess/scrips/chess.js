import { ChessClient} from "./server-client.js";

async function init(){
    const game = new Game()
    await game.client.syncMove(3,"RH7A7",_ => {alert("added move successfully")})
    
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