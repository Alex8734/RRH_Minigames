
export class ServerClient{
    
    baseURL = "http://localhost:3000"
    async getAllGames(){
        return await fetch(this.baseURL)
            .then(response => response.json())
    }

    async getLastMove(gameId)
    {
        return this.getAllMoves(gameId).slice(-1)
    }

    async getAllMoves(gameId, onError)
    {
        const response = await fetch(`${this.baseURL}/${gameId}`);
        if (!response.ok)
        {
            onError(response);
            return;
        }
        const game = await response.json();
        return game.moves;
    }

    async syncMove(gameId, move, success, onError)
    {

        let moves = await this.getAllMoves(gameId, onError)
        if (!moves)
        {
            return;
        }
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
        }).catch(() => onError) .then(() => success())
    }
}

export class ChessClient extends ServerClient
{
    
    constructor()
    {
        const s = super();
        this.baseURL = `${s.baseURL}/chess`;
    }
    
    
    
}

export class TicTacToeClient extends ServerClient
{
    constructor()
    {
        const s = super();
        this.baseURL = `${s.baseURL}/tictactoe`
    }
    
    
}

