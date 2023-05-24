import {Game} from "./Game.js";
import {init} from "../SpaceShooter/scripts/main.js";
document.addEventListener('DOMContentLoaded', function() {
    let checkbox = document.getElementById('logo-button');
    let filterMenu = document.getElementById('filter-menu');
    let dropdownHeaders = document.getElementsByClassName('dropdown-header')
    let dropdowns = document.getElementsByClassName('dropdown')
    let dropdownLists = document.getElementsByClassName('dropdown-list')
    const gamesContainer = document.getElementById('start-page');

    loadGames();

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            filterMenu.style.width = '0%';
            gamesContainer.style.width = '100%';
        } else {
            filterMenu.style.width = '15%';
            gamesContainer.style.width = '85%';
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
                for (let l = 0; l < items.length; l++) {
                    if (l !== k) {
                        items[l].classList.remove('selected');
                    }
                }
                items[k].classList.add('selected');
            });
        }
    }

    function loadGames()
    {
        let games = []
        games.push(new Game('', 'SpaceDoger', init, './Pics/games/DALL·E 2023-05-24 11.43.22 - make a cover for a game where you fly in space.png'))
        for (let game of games)
        {
            gamesContainer.innerHTML += game.getHtml();
        }
    }
})
