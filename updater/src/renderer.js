const { ipcRenderer, app } = require('electron');
const superagent = require('superagent').agent();
var fs = require('fs');
var DecompressZip = require('decompress-zip');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener('DOMContentLoaded', function() { // Seems to work (tm)
    firstStart();
}, false);


// Save Event
gng.addEventListener("change", () => {
    getFiles();
    save();
});
files.addEventListener("change", () => {
    save();
});

let updateBtn = document.getElementById('update');
updateBtn.addEventListener('click', () => {
    removeFileItems();
    getUpdates();
});

// Remove all files when changing Region --> WIP no nicht
function removeFileItems() {
    var i, L = dropDownFiles.options.length - 1;
    for (i = L; i >= 0; i--) {
        dropDownFiles.remove(i);
    }
}

function changeUserpath() {
    ipcRenderer.send('app-path');
}

ipcRenderer.on("app-path", (event, value) => {
    systemstructure.path = value[0];
    dirBox.value = value[0];
    fs.writeFileSync(systemstructure.path + "\\" + settings, JSON.stringify(structure, null, 4), 'utf8');
})

ipcRenderer.on("download progress", (event, progress) => {
    const cleanProgressInPercentages = Math.floor(progress.percent * 100); // Without decimal point
    document.getElementById('progressbar').value = cleanProgressInPercentages;
});

// let downloadBtn = document.getElementById('download');
// downloadBtn.addEventListener('click', (e) => {
//     var systemReadJson = JSON.parse(fs.readFileSync(systemsettings, 'utf8'));
//     var userReadJson = JSON.parse(fs.readFileSync(systemReadJson.path + settings, 'utf8'));
//     downloadFile(files.options[files.selectedIndex].href, systemReadJson.path);
// });
let testBtn = document.getElementById('test');
testBtn.addEventListener('click', (e) => {
    var systemReadJson = JSON.parse(fs.readFileSync(systemsettings, 'utf8'));
    var userReadJson = JSON.parse(fs.readFileSync(systemReadJson.path + settings, 'utf8'));
    decompress(files.options[files.selectedIndex].href, systemReadJson.path)
});