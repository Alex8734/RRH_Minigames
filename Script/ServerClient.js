export class HttpClient {

    address = "10.9.11.1";

    getUserInfo()
    {
        fetch(`${this.address}/User`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authentication": localStorage.getItem("token"),
            },
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

}