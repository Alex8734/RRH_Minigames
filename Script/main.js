import {Game} from "./Game.js";
document.addEventListener('DOMContentLoaded', function() {
    let checkbox = document.getElementById('logo-button');
    let search = document.getElementById('input');
    let filterMenu = document.getElementById('filter-menu');
    let dropdownHeaders = document.getElementsByClassName('dropdown-header')
    let dropdowns = document.getElementsByClassName('dropdown')
    let dropdownLists = document.getElementsByClassName('dropdown-list')
    const gamesContainer = document.getElementById('start-page');
    let currentCategory = Category.None;
    let currentSortBy = SortBy.None;
    let searched = '';

    loadGames(Category.None, SortBy.None, searched);

    search.addEventListener('keyup', () => {
        searched = search.value.toLowerCase();
        loadGames(currentCategory, currentSortBy, searched);
    });

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
                if (j === 0)
                {
                    currentSortBy = sortByKeys[k]
                }
                else if (j === 1)
                {
                    currentCategory = categoryKeys[k];
                }
                loadGames(currentCategory, currentSortBy, searched)
            });
        }
    }

    function loadGames(category, sortBy, searched)
    {
        gamesContainer.innerHTML = '';
        let games = []
        games.push(new Game('', 'SpaceDoger', 'SpaceShooter/spaceGame.html','./Pics/games/DALL·E 2023-05-24 11.43.22 - make a cover for a game where you fly in space.png', Category.Space))

        for (let game of games)
        {
            if ((category === game.category || category === Category.None) && (game.name.toLowerCase().startsWith(searched) || searched === ''))
            {
                gamesContainer.innerHTML += game.getHtml();
            }
        }
    }
});



export const Category = {
    OneVOne: '1v1',
    Space: 'Space',
    Drive: 'Drive',
    None: 'none',
};

const SortBy = {
    Players: 'players',
    Release: 'release',
    None: 'none',
};
const sortByKeys = Object.keys(SortBy);
const categoryKeys = Object.keys(Category);