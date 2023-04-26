
export class ServerClient{
    
    baseURL = "http://localhost:3000"
    async getAllGames(){
        return await fetch(this.baseURL)
            .then(response => response.json())
    }
    
}

export class ChessClient extends ServerClient
{
    
    
    constructor()
    {
        const s = super();
        this.baseURL = `${s.baseURL}/chess`
    }
    
    async getLastMove(gameId){
        console.log(this.baseURL)
        const response = await fetch(`${this.baseURL}/${gameId}`);
        const game = await response.json();
        return game.moves.slice(-1)
    } 
    async getAllMoves(gameId){
        console.log(this.baseURL)
        const response = await fetch(`${this.baseURL}/${gameId}`);
        const game = await response.json();
        return game.moves
    }
    async syncMove(gameId, move, success){
        
        let moves =  await this.getAllMoves(gameId)
        moves.push(move)
        const data = {
            'moves': moves
        }

        fetch(`${this.baseURL}/${gameId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(() => success())
    }
}



