// Buttons
const startDownload = document.querySelector('startDownload');
const stopDownload = document.querySelector('stopDownload');
const startUnzip = document.querySelector('startUnzip');
const stopUnzip = document.querySelector('stopUnzip');
const selectVersionBtn = document.querySelector('selectVersion');
const selectPathBtn = document.querySelector('selectPathBtn');
const writeFile = document.querySelector('writeFile');

const { remote, ipcRenderer } = require('electron');
const { writeFile } = require('fs');

document.getElementById('btn').addEventListener('click', () => {
    const filePath = window.electronAPI.openFile()
    document.getElementById('filePath').innerText = filePath
});


ipcRenderer.on("download complete", (event, file) => {
    console.log(file); // Full file path
});
ipcRenderer.on("download progress", (event, progress) => {
    console.log(progress); // Progress in fraction, between 0 and 1
    const progressInPercentages = progress * 100; // With decimal point and a bunch of numbers
    const cleanProgressInPercentages = Math.floor(progress * 100); // Without decimal point
});


// Select Folder
document.getElementById('dirs').addEventListener('click', (evt) => {
    evt.preventDefault()
    window.postMessage({
        type: 'select-dirs',
    })
});



document.getElementById('openButton').addEventListener('click', () => {
    console.log("Test");
    ipcRenderer.send('openFile', {})
});