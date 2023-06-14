export class HttpClient {

    address = "10.9.11.1";

    async getUserStats()
    {
        const response = await fetch(`${this.address}/User/stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authentication": localStorage.getItem("token"),
            },
        });

        return await response.json()
    }

    login(user)
    {
        const data = {
            name: user.name,
            email: user.email,
            password: user.password,
        }

        fetch(`${this.address}/User/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                const token = data.token;
                localStorage.setItem('token', token);
                console.log('Token saved successfully!');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    registerUser(user)
    {
        const data = {
            name: user.name,
            email: user.email,
            password: user.password,
        }

        fetch(`${this.address}/User/register`, {
            method: "POST",
                headers: {
            "Content-Type": "application/json"
        },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                const token = data.token;
                localStorage.setItem('token', token);
                console.log('Token saved successfully!');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async getLastMove(gameId) {
        const response = await fetch(`${this.address}/Chess/lastMove`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authentication": localStorage.getItem("token"),
            }

        });
        return await response.json();
    }

    async getPlayers(gameId) {
        const response = await fetch(`${this.address}/Chess/players`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authentication": localStorage.getItem("token"),
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
                "authentication": localStorage.getItem("token"),
            },
            body: JSON.stringify(data),
        });

        return  response.json();
    }

}