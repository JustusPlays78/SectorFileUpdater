// Global Variabels
let settingsProfileDirselectbutton = document.getElementById('settingsProfileDirselectbutton');
let dirBox = document.getElementById('dirBox');
let usernameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
let passwordhoppieInput = document.getElementById('passwordhoppie');
let realnameInput = document.getElementById('realname');
let saveCredBtn = document.getElementById('savecred');
let rating = document.getElementById('rating');
let progressbar = document.getElementById('progressbar');
let downloadBtn = document.getElementById('download');

// CheckBox Events
let checkBoxUsername = document.getElementById('saveuser');
let checkBoxPassword = document.getElementById('savepw');
let checkBoxSavepwhoppie = document.getElementById('savepwhoppie');
let checkBoxRealname = document.getElementById('saverealname');
let applyToPrf = document.getElementById('applyToPrf');
let applyHoppie = document.getElementById('applyHoppie');

// Check update
let dropDownGNG = document.getElementById('gng');
let dropDownFiles = document.getElementById('files');

const homeDiv = document.getElementById('homeDiv');
const pushDiv = document.getElementById('pushDiv');
const settingsDiv = document.getElementById('settingsDiv');

saveCredBtn.addEventListener('click', (e) => {
    save();
});

settingsProfileDirselectbutton.addEventListener('click', (e) => {
    changeUserpath();
});