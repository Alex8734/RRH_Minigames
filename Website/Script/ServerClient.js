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


    async EndGame(gameId, winnerName, onError){
        const response = await fetch(`${this.address}/Game/Endgame/${gameId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            },

            body: JSON.stringify(winnerName)
        });
        if (!response.ok){
            onError(await response.json())
        }
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

    async dequeue(game){
        const response = await fetch(`${this.address}/Game/Dequeue`, {
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
    
    async queue(game)
    {
        let token = sessionStorage.getItem("token");
        if ( token === null){
            await this.registerAnonymous();
        }
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

    async getGameID(success) {
        const response = await fetch(`${this.address}/Game/GameStarted`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            }
        });
        if (response.ok){
            var data = await response.json();
            success(data)
        }
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

    async startSoloGame(game){
        const response = await fetch(`${this.address}/Game/StartSoloGame`, {
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

    async endSoloGame(gameId, stat, gameName)
    {
        const response = await fetch(`${this.address}/Game/EndSoloGame/${gameId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Host": `${this.address}`
            },
            body: JSON.stringify({
                "game":gameName,
                "score":stat
            })
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
        const response = await fetch(`${this.address}/User/RegisterAnonymous`, {
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