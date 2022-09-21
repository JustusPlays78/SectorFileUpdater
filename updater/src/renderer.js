// Buttons
const startDownload = document.querySelector('startDownload');
const stopDownload = document.querySelector('stopDownload');
const startUnzip = document.querySelector('startUnzip');
const stopUnzip = document.querySelector('stopUnzip');
const selectVersionBtn = document.querySelector('selectVersion');
const selectPathBtn = document.querySelector('selectPathBtn');

var directoryPath = "C:";

const { remote } = require('electron');
const { Menu } = remote;
const { writeFile } = require('fs');


// Will not work
async function selectVersion() {
    const versionMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: release.name,
                click: () => selectVersion(source)
            };
        })
    );
    selectVersion.popup();
}

// Git version update Select
async function selectVersion(source) {
    selectVersionBtn.innerText = source.name;
    const constrains = {
        // Maybe needed
    }
}

// select Euroscope folder - TBD
async function selectPath(source) {
    selectPathBtn.innerText = source.name;
    const constrains = {
        // Maybe needed
    }
}

async function downloadVersion(e) {
    shell = new ActiveXObject("WScript.Shell");
    const file; // File to download

    const { filepath } = await dialog.showSaveDialog({
        buttonLabel: 'Save Update Version',
        defaultPath: shell.SpecialFolders('MyDocuments') + '\\Euroscope'
    });

    console.log(filepath);
    writeFile(filepath, file, () => console.log('file saved successfully!'));
}





ipcRenderer.send("download", {
    url: "https://dms.pabr.de/s/SpBiQYADTNak7R5/download",
    properties: { directory: directoryPath }
});

const { ipcRenderer } = require("electron");
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
})





// Get releases from Gitlab