const { ipcRenderer, dialog } = require('electron');
const superagent = require('superagent').agent();

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

ipcRenderer.on("filepath", (event, file) => {
    document.getElementById('dirBox').innerText = file;
});


// Check update
let dropDownGNG = document.getElementById('gng');
let dropDownFiles = document.getElementById('files');

let updateBtn = document.getElementById('update');
updateBtn.addEventListener('click', (e) => {
    removeFileItems();
    getUpdates();
});

// Remove all files when changing Region --> WIP no nicht
const removeFileItems = async() => {
    var i, L = dropDownFiles.options.length - 1;
    for (i = L; i >= 0; i--) {
        dropDownFiles.remove(i);
    }
}

const getUpdates = async() => {

    // Get all GNG Options
    let courses = await superagent.get('https://files.aero-nav.com/');
    let text = courses.text.split("Download Pages").pop();
    let liste = "";
    for (var i = 0; i < text.length; i++) {
        if (text[i] === ">" && text[i - 1] === "b" && text[i - 2] === "<") {
            let i2 = i + 1;
            while (text[i2] !== "<") {
                liste += text[i2];
                i2++;
            }
            liste += "\n";
        }
    }
    const listeArray = liste.split("\n");

    // Add to html selector
    listeArray.pop();
    listeArray.forEach(optionsAdd);

    // Add Elements to Drop Down
    function optionsAdd(item) {
        var option = document.createElement("option");
        option.text = item;
        dropDownGNG.add(option);
    }
}

// Check Files
let getFilesBtn = document.getElementById('getFiles');
getFilesBtn.addEventListener('click', (e) => {
    getFiles();
});

const getFiles = async() => {
    removeFileItems();
    // Get all GNG Package Options
    let region = "https://files.aero-nav.com/" + dropDownGNG.options[dropDownGNG.selectedIndex].text;
    let courses = await superagent.get(region);
    let text = courses.text.split("Released</th><th colspan='2'>Download</th></tr>").pop();
    text = text.split("<h1>AIRAC <small>News</small></h1>")[0]
    console.log(text);
    let rows = "";
    for (var i = 0; i < text.length; i++) {
        if (text[i] + text[i + 1] + text[i + 2] + text[i + 3] === "<td>") {
            let i2 = i + 4;
            while (text[i2] + text[i2 + 1] + text[i2 + 2] + text[i2 + 3] + text[i2 + 4] !== "</td>") {
                rows += text[i2];
                i2++;
            }
            rows += "\n";
        }
    }
    // console.log(rows); // For debugging only

    // All Rows in Table
    const listeArray = rows.split("\n");
    listeArray.pop();
    let fileNames = "";
    // Select only Package names
    for (var i = 1; i < listeArray.length; i = i + 5) {
        fileNames += listeArray[i] + "\n";
    }
    const fileNamesArray = fileNames.split("\n");
    fileNamesArray.pop();
    fileNamesArray.forEach(optionsAdd);

    // Add Elements to Drop Down
    function optionsAdd(item) {
        var option = document.createElement("option");
        option.text = item;
        dropDownFiles.add(option);
    }
}