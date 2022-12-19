const { ipcRenderer, dialog } = require('electron');
const shell = require('electron').shell;

ipcRenderer.on("download complete", (event, file) => {
    console.log(file); // Full file path
    // Datei entpacken
});

ipcRenderer.on("download progress", (event, progress) => {
    const cleanProgressInPercentages = Math.floor(progress.percent * 100); // Without decimal point
    document.getElementById('progressbar').value = cleanProgressInPercentages;
});

let donwloadbtn = document.getElementById('download');
donwloadbtn.addEventListener('click', (e) => {
    let directoryPath = document.getElementById('dirBox');
    let urlPath = document.getElementById('urlBox');
    ipcRenderer.send("download", {
        url: urlPath.value,
        properties: { directory: directoryPath.value }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dirs').addEventListener('click', function() {
        openFile();
    });
});

function openFile() {
    ipcRenderer.send('openFolder', () => {
        console.log("Event sent.");
    });
}

ipcRenderer.on('folderData', (event, data) => {
    console.log(data)
})


let shellBtn = document.getElementById('script');
shellBtn.addEventListener('click', (e) => {
    shell.openItem("./test.sh")
});