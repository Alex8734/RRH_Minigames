let symbol;
let closeButton;
let settingNav;
let colorRadios;

document.addEventListener('DOMContentLoaded', () => {
    symbol = document.getElementById('settings');
    closeButton = document.getElementById('close');
    settingNav = document.getElementById('settings-nav');
    colorRadios = document.getElementsByClassName('form-check-input');
    symbol.addEventListener('click', () => {
        settingNav.style.width = '18%';
    });

    closeButton.addEventListener('click', () => {
        settingNav.style.width = '0%';
    });

    for (let i = 0; i < colorRadios.length; i++) {
        colorRadios[i].addEventListener('change', () => {
            if (colorRadios[i].checked) {
                changeColor(i);
            }
        });
    }
});

function changeColor(index)
{
    switch (colorRadios[index].value) {
        case 'blue':
            document.documentElement.style.setProperty('--primary-color', '#05025e');
            document.documentElement.style.setProperty('--secondary-color', '#082199');
            document.documentElement.style.setProperty('--border-color', '#000000');
            document.documentElement.style.setProperty('--box-shadow', 'rgba(255, 255, 255, 0.5)');
            document.documentElement.style.setProperty('--settings-background', '#2605d4');
            break;
        case 'black':
            document.documentElement.style.setProperty('--primary-color', '#000000');
            document.documentElement.style.setProperty('--secondary-color', '#131618');
            document.documentElement.style.setProperty('--border-color', '#ff0000');
            document.documentElement.style.setProperty('--box-shadow', 'rgba(255, 255, 255, 0.5)');
            document.documentElement.style.setProperty('--settings-background', '#212529');
            break;
        case 'orange':
            document.documentElement.style.setProperty('--primary-color', '#ff8800');
            document.documentElement.style.setProperty('--secondary-color', '#ff9c34');
            document.documentElement.style.setProperty('--border-color', '#ff8800');
            document.documentElement.style.setProperty('--box-shadow', 'rgba(255, 255, 255, 0.5)');
            document.documentElement.style.setProperty('--settings-background', '#ff8800');
            break;
    }
}