// Global Variabels
let dirBox = document.getElementById('dirBox');
let usernameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
let passwordhoppieInput = document.getElementById('passwordhoppie');
let saveCredBtn = document.getElementById('savecred');

// CheckBox Events
let checkBoxUsername = document.getElementById('saveuser');
let checkBoxPassword = document.getElementById('savepw');
let checkBoxSavepwhoppie = document.getElementById('savepwhoppie');

// Check update
let dropDownGNG = document.getElementById('gng');
let dropDownFiles = document.getElementById('files');

saveCredBtn.addEventListener('click', (e) => {
    save();
});