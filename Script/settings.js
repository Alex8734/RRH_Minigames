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
                switch (colorRadios[i].value) {
                    case 'blue':
                        document.documentElement.style.setProperty('--primary-color', '#007bff');
                        document.documentElement.style.setProperty('--secondary-color', '#17a2b8');
                        document.documentElement.style.setProperty('--border-color', '#007bff');
                        document.documentElement.style.setProperty('--box-shadow', 'rgba(0, 123, 255, 0.5)');
                        document.documentElement.style.setProperty('--settings-background', '#007bff');
                        break;
                    case 'black':
                        document.documentElement.style.setProperty('--primary-color', '#212529');
                        document.documentElement.style.setProperty('--secondary-color', '#6c757d');
                        document.documentElement.style.setProperty('--border-color', '#212529');
                        document.documentElement.style.setProperty('--box-shadow', 'rgba(33, 37, 41, 0.5)');
                        document.documentElement.style.setProperty('--settings-background', '#212529');
                        break;
                    case 'orange':
                        document.documentElement.style.setProperty('--primary-color', '#ff8800');
                        document.documentElement.style.setProperty('--secondary-color', '#ff9c34');
                        document.documentElement.style.setProperty('--border-color', '#ff8800');
                        document.documentElement.style.setProperty('--box-shadow', 'rgba(255, 136, 0, 0.5)');
                        document.documentElement.style.setProperty('--settings-background', '#ff8800');
                        break;
                    // Add more cases for other color options
                }
            }
        });
    }
});
