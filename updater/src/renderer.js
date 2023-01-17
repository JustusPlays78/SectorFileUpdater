const { ipcRenderer, dialog } = require('electron');
var DecompressZip = require('decompress-zip');

// Global Variabels

let systempath = "systemfile.json";
let userFile = "\\userfile.json";
var userjson = {
    region: 0,
    file: 0,
    cid: {
        save: true,
        id: 0
    },
    password: {
        save: true,
        pass: "NaN"
    },
    currentInstalledAirac: 0
};

var systemJson = {
    userpath: ""
};

document.addEventListener('DOMContentLoaded', function() { // Seems to work (tm)
    firstStart();
    save();
}, false);


let firstStart = () => {
    try {
        const data = fs.readFileSync(systempath, 'utf8');
    } catch (err) {
        // Create file
        fs.writeFile(systempath, JSON.stringify(systemJson), { flag: 'wx' }, function(err) {
            if (err) throw err;
        });
    }

    var systemReadJson = JSON.parse(fs.readFileSync(systempath, 'utf8'));

    try {
        const data = fs.readFileSync(systemReadJson.userpath + userFile, 'utf8');
        userjson = data;
    } catch (err) {
        // Create file
        changeUserpath();
    } finally {
        var userReadJson = JSON.parse(fs.readFileSync(systemReadJson.userpath + userFile, 'utf8'));
        getUpdates();
        // Set from file does not work
        gng.selectedIndex = userReadJson.region;
        if (files.selectedIndex < 0) {
            files.selectedIndex = 0;
        } else {
            files.selectedIndex = userReadJson.file;
        }
        save();
    }
}
let changeUserpath = () => {
    ipcRenderer.send('select-dirs'); // DOES NOT WORK!
}
ipcRenderer.on("path selected", (event, value) => {
    var systemReadJson = JSON.parse(fs.readFileSync(systempath, 'utf8'));
    systemReadJson.userpath = value[0];
    fs.writeFile(systemReadJson.userpath + userFile, JSON.stringify(userjson), function(err) {
        if (err) throw err;
    });
    fs.writeFile(systempath, JSON.stringify(systemReadJson), function(err) {
        if (err) throw err;
    });
})

ipcRenderer.on("download progress", (event, progress) => {
    const cleanProgressInPercentages = Math.floor(progress.percent * 100); // Without decimal point
    document.getElementById('progressbar').value = cleanProgressInPercentages;
});

let donwloadBtn = document.getElementById('download');
donwloadBtn.addEventListener('click', (e) => {
    let directoryPath = document.getElementById('dirBox');
    let urlPath = document.getElementById('urlBox');
    ipcRenderer.send("download", {
        url: urlPath.value,
        properties: { directory: directoryPath.value }
    });
});
let directoryBtn = document.getElementById('dirs');
directoryBtn.addEventListener('click', (e) => {
    window.postMessage({
        type: 'select-dirs'
    })
});

ipcRenderer.on("filepath", (event, file) => {
    document.getElementById('dirBox').innerText = file;
});

let extractBtn = document.getElementById('extract');
extractBtn.addEventListener('click', () => {
    let directoryPath = document.getElementById('dirBox');
    let urlPath = document.getElementById('urlBox');
    ipcRenderer.send("extract", {
        url: urlPath.value,
        properties: { directory: directoryPath.value }
    });
});