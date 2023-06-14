import {Game} from "./Game.js";
import {HttpClient} from "./ServerClient.js";

const httpClient = new HttpClient();

document.addEventListener('DOMContentLoaded', async function() {
    let checkbox = document.getElementById('logo-button');
    let search = document.getElementById('input');
    let filterMenu = document.getElementById('filter-menu');
    let dropdownHeaders = document.getElementsByClassName('dropdown-header')
    let dropdowns = document.getElementsByClassName('dropdown')
    let dropdownLists = document.getElementsByClassName('dropdown-list')
    const gamesContainer = document.getElementById('start-page');
    let currentCategory = Category.none;
    let currentSortBy = SortBy.none;
    let searched = '';

    loadGames(currentCategory, currentSortBy, searched);
    
    search.addEventListener('keyup', () => {
        searched = search.value.toLowerCase();
        loadGames(currentCategory, currentSortBy, searched);
    });

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            filterMenu.style.width = '0%';
            gamesContainer.style.width = '100%';
        } else {
            filterMenu.style.width = '20%';
            gamesContainer.style.width = '80%';
        }
    });

    for (let i = 0; i < dropdownHeaders.length; i++) {
        dropdownHeaders[i].addEventListener("click", function() {
            var dropdown = dropdowns[i];
            if (dropdown.style.height > '0px') {
                dropdown.style.height = `0px`;
            } else {
                let childs = dropdownLists[i].childElementCount;
                dropdown.style.height = `${((childs * 2.1) + 0.2)}vw`;

                for(let j = 0; j < dropdownHeaders.length; j++){
                    if (j != i)
                    {
                        var dropdown = dropdowns[j];
                        dropdown.style.height = `0px`;
                    }
                }
            }
        });
    }

    for (let j = 0; j < dropdownLists.length; j++) {
        let items = dropdownLists[j].children;
        for (let k = 0; k < items.length; k++) {
            items[k].addEventListener('click', function() {

                if (items[k].classList.contains('selected'))
                {
                    if (j === 0)
                    {
                        currentSortBy = sortByKeys[2]
                    }
                    else if (j === 1)
                    {
                        currentCategory = categoryKeys[3];
                    }
                    items[k].classList.remove('selected');
                    loadGames(currentCategory, currentSortBy, searched);
                    return;
                }

                for (let l = 0; l < items.length; l++) {
                    if (l !== k) {
                        items[l].classList.remove('selected');
                    }
                }

                items[k].classList.add('selected');

                if (j === 0)
                {
                    currentSortBy = sortByKeys[k]
                }
                else if (j === 1)
                {
                    currentCategory = categoryKeys[k];
                }
                loadGames(currentCategory, currentSortBy, searched);
            });
        }
    }

    function loadGames(category, sortBy, searched)
    {
        gamesContainer.innerHTML = '';
        let games = []
        games.push(new Game('', 'Starship Dodge', 'SpaceShooter/spaceGame.html','./Pics/games/spaceDodge1.png', Category.Space))
        games.push(new Game('', 'Speed On the Street', 'StreetSpeed/SpeedStreet.html','./Pics/games/speedOnTheStreet.png', Category.Drive))
        games.push(new Game('', 'Chess', 'Chess/index.html','./Pics/games/apoapodasistred.png', Category.Drive))


        for (let game of games)
        {
            if ((category === game.category || category === Category.none) && (game.name.toLowerCase().startsWith(searched) || searched === ''))
            {
                gamesContainer.innerHTML += game.getHtml();
            }
        }
    }
});

document.getElementById("sign-in").addEventListener("click", function() {
    showLoginForm();
});

function showLoginForm() {
    var loginForm = document.querySelector(".login-form");
    loginForm.style.height = '100%';
    $("#login-info").html("")
}
function hideLoginForm() {
    var loginForm = document.querySelector(".login-form");
    loginForm.style.height = '0%';
    $("#login-info").html("")
}

document.getElementById("create-account").addEventListener("click", async function() {
    event.preventDefault();
    await createAccount();
    await printStats();
});
document.getElementById("login").addEventListener("click", async function() {
    event.preventDefault();
    await login();
    await printStats();
});

async function createAccount() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let worked = false;
    if (password === confirmPassword) {
        worked = await httpClient.registerUser({ name, email, password },  (error)=>
        {
            $("#login-info").html(error)
        })
        if (worked){
            document.getElementById('sign-in').style.display = 'none';
            alert('Account created successfully!');
        }
    }
    else {
        alert("Passwords were incorrect");
    }

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirm-password").value = "";
    if (worked){
        hideLoginForm();
    }
    
}

async function login()
{
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let worked =false;
    if (password === confirmPassword) {
        worked = await httpClient.loginUser({name, email, password},  (error) =>
        {
            document.getElementById("login-info").innerHTML = error;
        })
        if (worked)
        {
            document.getElementById('sign-in').style.display = 'none';
            alert('Account logged in successfully!');
        }
    }
    else {
        alert("Passwords were incorrect");
    }

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirm-password").value = "";
    if (worked)
    {
        hideLoginForm();
    }
}

export const Category = {
    OneVOne: '1v1',
    Space: 'Space',
    Drive: 'Drive',
    none: 'none',
};

const SortBy = {
    Players: 'players',
    Release: 'release',
    none: 'none',
};
const sortByKeys = Object.keys(SortBy);
const categoryKeys = Object.keys(Category);

async function printStats()
{
    let stats = document.getElementById('stats');
    let html = '';
    let json = await httpClient.getUserStats((error)=>{
        stats.innerHTML = `<h2>loading failed...: ${error}</h2>`
    });
    
    for (let i = 0; i < json.length; i++)
    {
        if (json[i].Game == 'Chess')
        {
            html += `<div id="game-stats">
                    <h2>${json[i].Game}</h2>
                    <p>Losses: ${json[i].HighScore}<br>
                    Wins: ${json[i].PlayCount}</p>
                 </div>`;
        }
        else
        {
            html += `<div id="game-stats">
                    <h2>${json[i].Game}</h2>
                    <p>Highscore: ${json[i].HighScore}<br>
                    Playcount: ${json[i].PlayCount}</p>
                 </div>`;
        }
    }
    stats.innerHTML = html;
}
