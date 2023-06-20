export class HttpClient {

    address = "http://localhost:5001";

    async getUserStats(onError)
    {
        const response = await fetch(`${this.address}/User/Stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            },
        });
        const respData = await response.json();
        if (!response.ok){
            onError(respData)
        }
        return respData
    }

    async postUserStats(game, score)
    {
        const data = {
            game: game,
            score: score
        }

        const response = await fetch(`${this.address}/User/Stats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    }

    async loginUser(user, onError)
    {
        const data = {
            Identity: user.name,
            Password: user.password
        }

        const response = await fetch(`${this.address}/User/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Host": `${this.address}`
            },
            body: JSON.stringify(data)
        })
        const respData = await response.json();
        if (!response.ok)
        {
            return false;
        }
        sessionStorage.setItem('token', respData.Token);
        sessionStorage.setItem('user', respData.UserName)
        return true;
    }

    async endGame(gameId, winner)
    {
        const response = await fetch(`${this.address}/Game/EndGame/${gameId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            },
            body: JSON.stringify(winner)
        });
        return await response.json();
    }

    async registerUser(user, onError)
    {
        const data = {
            UserName: user.name,
            Email: user.email,
            Password: user.password,
        }

        const response = await fetch(`${this.address}/User/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
                "Host": `${this.address}`
        },
            body: JSON.stringify(data)
        })
        const respData = await response.json();
        if (!response.ok){
            
            onError(respData)
            return false;
        }
        sessionStorage.setItem('token', respData.Token);
        sessionStorage.setItem('user', respData.UserName)
        return true;
    }

    async getPlayers(gameId) {
        const response = await fetch(`${this.address}/Game/Players/${gameId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            }
        });
        return (await response.json()).value;
    }

    async queue(game)
    {
        const response = await fetch(`${this.address}/Game/Queue`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            },
            body: JSON.stringify(game)
        });
        return await response.json();
    }

    async getGameID() {
        const response = await fetch(`${this.address}/Game/GameStarted`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            }
        });
        return await response.json();
    }

    async getLastMove(gameId)
    {
        const data = {
            value: gameId,
        }
        const response = await fetch(`${this.address}/Game/LastMove/${gameId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            },
        });

        return await response.json();
    }

    async postLastMove(gameId, move)
    {
        const data = {
            GameId: gameId,
            Move: move,
        };

        const response = await fetch(`${this.address}/Game/LastMove`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            },
            body: JSON.stringify(data)
        });
    }


    async registerAnonymous()
    {
        const response = await fetch(`${this.address}/User/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Host": `${this.address}`
            },
        })
        const respData = await response.json();
        if (!response.ok)
        {
            return false;
        }
        sessionStorage.setItem('token', respData.Token);
        sessionStorage.setItem('user', respData.UserName)
        return true;
    }
}