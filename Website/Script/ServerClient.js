export class HttpClient {

    address = "http://localhost:5001";

    async getUserStats(onError)
    {
        const response = await fetch(`${this.address}/User/Stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
            UserName: user.name,
            Email: user.email,
            Password: user.password,
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
            
            onError(respData)
            return false;
        }
        localStorage.setItem('token', respData.value);
        return true;
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
        localStorage.setItem('token', respData.value);
        return true;
    }

    async getLastMove(gameId) {
        const response = await fetch(`${this.address}/Chess/lastMove`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Host": `${this.address}`
            }

        });
        return await response.json();
    }

    async getPlayers(gameId) {
        const response = await fetch(`${this.address}/Chess/players`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Host": `${this.address}`
            }
        });
        return await response.json();
    }

    async pushMove(gameId, moveStr){
        const data = {
            gameId: gameId,
            move: moveStr,
        };
        const response = await fetch(`${this.address}/Chess/lastMove`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Host": `${this.address}`
            },
            body: JSON.stringify(data),
        });

        return  response.json();
    }

}