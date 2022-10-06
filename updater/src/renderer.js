const { ipcRenderer, dialog } = require('electron');
var DecompressZip = require('decompress-zip');

ipcRenderer.on("download complete", (event, file) => {
    console.log(file); // Full file path
    // Datei entpacken
});

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

let extractBtn = document.getElementById('extract');
extractBtn.addEventListener('click', (e) => {
    let directoryPath = document.getElementById('dirBox');
    let urlPath = document.getElementById('urlBox');
    ipcRenderer.send("extract", {
        url: urlPath.value,
        properties: { directory: directoryPath.value }
    });
    console.log("Töfte");
});