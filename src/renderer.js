const { ipcRenderer, app } = require('electron');
const superagent = require('superagent').agent();
var fs = require('fs');

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

ipcRenderer.on("app-dest", (event, value) => {
    systemstructure.path = value[0];
    dirBox.value = value[0];
    console.log(systemstructure.path);
    fs.writeFileSync(filePath + "\\" + systemsettings, JSON.stringify(systemstructure, null, 4), 'utf8');
    location.reload();
})

let progressbarText = document.getElementById('progressbarText');
ipcRenderer.on("download progress", (event, progress) => {
    const cleanProgressInPercentages = Math.floor(progress.percent * 100); // Without decimal point
    document.getElementById('progressbar').value = cleanProgressInPercentages;
});

downloadBtn.addEventListener('click', (e) => {
    downloadFile(files.options[files.selectedIndex].href);
});

ipcRenderer.on('progressbar', (event, args) => {
    progressbarText.innerHTML = args.progress + "%";
    progressbar.value = args.progress;
});

rating.addEventListener('change', (e) => {
    save();
});

applyToPrf.addEventListener('click', (e) => {
    save();
});

applyHoppie.addEventListener('click', (e) => {
    save();
});