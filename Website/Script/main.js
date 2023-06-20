import {Game} from "./Game.js";
import {HttpClient} from "./ServerClient.js";

const httpClient = new HttpClient();
export let userOrEmail = "";
export const Category = {
    OneVOne: 'OneVOne',
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
    //await httpClient.registerAnonymous();
    search.addEventListener('keyup', () => {
        searched = search.value.toLowerCase();
        loadGames(currentCategory, currentSortBy, searched);
    });
    
    $("#sign-in-switch").on('click')
    
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
        games.push(new Game('', 'Starship Dodge', './SpaceShooter/spaceGame.html','./Pics/games/spaceDodge1.png', Category.Space))
        games.push(new Game('', 'Speed On the Street', './StreetSpeed/SpeedStreet.html','./Pics/games/speedOnTheStreet.png', Category.Drive))
        games.push(new Game('', 'TicTacToe', './TicTacToe/index.html','./Pics/games/tictactoe.png', Category.OneVOne))
        games.push(new Game('', 'Chess', './Chess/index.html','./Pics/games/apoapodasistred.png', Category.OneVOne))


        for (let game of games)
        {
            if ((category === game.category || category === Category.none) && (game.name.toLowerCase().startsWith(searched) || searched === ''))
            {
                gamesContainer.innerHTML += game.getHtml();
            }
        }
    }

    if (sessionStorage.getItem('token') !== null)
    {
        document.getElementById('sign-in').style.display = 'none';
        await printStats()
    }
});

$("#login-form").on("click", function (event)
{
    if (!$(event.target).closest(".card-body").length)
    {
        hideLoginForm()
    }
});

const card = document.getElementById('card');
function flipCard() {
    card.classList.toggle('flip');
}

$("#sign-up-switch").click(function (event)
{
    event.preventDefault();
    flipCard();
});

$("#sign-in-switch").click(function (event){
    event.preventDefault()
    flipCard();
})

document.getElementById("sign-in").addEventListener("click", function() {
    showLoginForm();
});

function showLoginForm() {
    var loginForm = document.querySelector("#login-form");
    loginForm.style.height = '100%';
    $("#login-info").html("")
}
export function hideLoginForm() {
    var loginForm = document.querySelector("#login-form");
    loginForm.style.height = '0%';
    $("#login-info").html("")
}

document.getElementById("sign-up").addEventListener("click", async function() {
    event.preventDefault();
    await createAccount();
});
document.getElementById("log-in").addEventListener("click", async function() {
    event.preventDefault();
    await login();
});

async function createAccount() {
    let name = document.getElementById("username").value;
    let email = document.getElementById("Email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("password-Confirm").value;
    let worked = false;

    if (password === confirmPassword) {

        worked = await httpClient.registerUser({ name, email, password },  (error)=>
        {
            alert(error.value);
        })
        if (worked){
            document.getElementById('sign-in').style.display = 'none';
        }
    }

    document.getElementById("username").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-Confirm").value = "";


    if (worked){
        flipCard()
        hideLoginForm();
        printStats();
    }
}


async function login() {
    let name = document.getElementById("usernameX").value;
    let password = document.getElementById("passwordX").value;
    let worked = false;

    worked = await httpClient.loginUser({ name, password });

    if (worked) {
        document.getElementById('sign-in').style.display = 'none';
        hideLoginForm();
        printStats();
    }
    else
    {
        alert("login data incorrect");
    }
}

async function printStats()
{
    let stats = document.getElementById('stats');
    let html = '';
    let json = await httpClient.getUserStats((error)=>{
        stats.innerHTML = `<h2>loading failed...: ${error}</h2>`
    });
    json = json.value;
    console.log(json);
    for (let i = 0; i < json.length; i++)
    {
        if (json[i].game == "Chess" || json[i].game == "TicTacToe")
        {
            html += `<div id="game-stats">
                    <h2>${json[i].game}</h2>
                    <p>Losses: ${json[i].highScore}<br>
                    Wins and draws: ${json[i].playCount}</p>
                 </div>`;
        }
        else
        {
            html += `<div id="game-stats">
                    <h2>${json[i].game}</h2>
                    <p>Highscore: ${json[i].highScore}<br>
                    Playcount: ${json[i].playCount}</p>
                 </div>`;
        }
    }
    stats.innerHTML = html;
}

document.getElementById('profile').addEventListener('click', function() {
    window.location.href = './AccountDashboard/index.html';
});
