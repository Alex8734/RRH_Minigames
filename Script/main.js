document.addEventListener('DOMContentLoaded', function() {
    let checkbox = document.getElementById('logo-button');
    let filterMenu = document.getElementById('filter-menu');
    let dropdownHeaders = document.getElementsByClassName('dropdown-header')
    let dropdowns = document.getElementsByClassName('dropdown')
    let dropdownLists = document.getElementsByClassName('dropdown-list')

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            filterMenu.style.width = '0%';
        } else {
            filterMenu.style.width = '15%';
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
            }
        });
    }
});