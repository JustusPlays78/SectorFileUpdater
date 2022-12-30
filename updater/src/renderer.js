const { ipcRenderer, dialog, app } = require('electron');
const superagent = require('superagent').agent();
var fs = require('fs');
var DecompressZip = require('decompress-zip');
const { version } = require('os');

// Global Variabels
let dirBox = document.getElementById('dirs');
let usernameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
let passwordhoppieInput = document.getElementById('passwordhoppie');

// CheckBox Events
let checkBoxUsername = document.getElementById('saveuser');
let checkBoxPassword = document.getElementById('savepw');
let checkBoxSavepwhoppie = document.getElementById('savepwhoppie');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let systempath = "systemfile.json"; // soll weg
let userFile = "userfile.json"; // soll weg
var systemstructure = {
    path: ""
};
var structure = {
    region: 0,
    file: 0,
    installcreds: false, // Not yet implemented
    installhoppie: false, // Not yet implemented
    cid: {
        save: true,
        id: -1
    },
    password: {
        save: true,
        pass: ""
    },
    passwordhoppie: {
        save: true,
        pass: ""
    },
    currentInstalledAirac: 0,
    version: "v1"
};

document.addEventListener('DOMContentLoaded', function() { // Seems to work (tm)
    firstStart();
}, false);

let systemsettings = "system.json";
let settings = "settings.json";
var filepath;
async function firstStart() {
    await ipcRenderer.send('app-path');
    await ipcRenderer.on("app-path", async(event, path) => {
        filepath = path;
        // await delay(2000); // Not the best solution
        // filepath = await app.getPath('home') + '\\' + systemsettings;
        await console.log(filepath + "\\" + systemsettings);
        if (await fs.existsSync(filepath + "\\" + systemsettings)) {
            systemstructure = JSON.parse(fs.readFileSync(filepath + "\\" + systemsettings, 'utf8'));
        } else {
            await changeUserpath();
        }
        await console.log(systemstructure);
        await console.log("test");
        if (await fs.existsSync(systemstructure.path + "\\" + settings)) {
            structure = JSON.parse(fs.readFileSync(systemstructure.path + "\\" + settings, 'utf8'));
            if (structure.cid.save == true) {
                usernameInput.value = structure.cid.id;
            }
            if (structure.password.save == true) {
                passwordInput.value = structure.password.pass;
            }
            if (structure.passwordhoppie.save == true) {
                passwordhoppieInput.value = structure.passwordhoppie.pass;
            }
            dirBox.value = systemstructure.path;
            // GET INFO

        } else {
            fs.writeFileSync(systemstructure.path + "\\" + settings, JSON.stringify(structure, null, 4), 'utf8');
            gng.selectedIndex = structure.region;
            if (files.selectedIndex < 0) {
                files.selectedIndex = 0;
            } else {
                files.selectedIndex = structure.file;
            }
            // Broken

        }
        await getUpdates();
        gng.selectedIndex = structure.region;
        if (files.selectedIndex < 0) {
            files.selectedIndex = 0;
        } else {
            files.selectedIndex = structure.file;
        }
        await getFiles();
        save();
    });
}

// Save Event
gng.addEventListener("change", () => {
    getFiles();
    save();
});
files.addEventListener("change", () => {
    save();
});

function save() {
    // WORK HERE, new files
    // Read config
    structure = JSON.parse(fs.readFileSync(systempath.path + userFile, 'utf8'));
    structure.region = gng.selectedIndex;
    structure.file = files.selectedIndex;
    if (checkBoxUsername.checked == true) {
        structure.cid.id = usernameInput.value;
        structure.cid.save = true;
    } else {
        structure.cid.id = -1;
        structure.cid.save = false;
    }
    if (checkBoxPassword.checked == true) {
        structure.password.pass = passwordInput.value;
        structure.password.save = true;
    } else {
        structure.password.pass = "";
        structure.password.save = false;
    }
    if (checkBoxSavepwhoppie.checked == true) {
        structure.passwordhoppie.pass = passwordhoppieInput.value;
        structure.passwordhoppie.save = true;
    } else {
        structure.passwordhoppie.pass = "";
        structure.passwordhoppie.save = false;
    }
    // WIP
    //structure.currentInstalledAirac = currentAirac;
    //structure.version = airacversion;
    // Save config
    fs.writeFileSync(systemstructure.path + "\\" + userFile, JSON.stringify(structure, null, 4), 'utf8');
};

// Check update
let dropDownGNG = document.getElementById('gng');
let dropDownFiles = document.getElementById('files');

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

async function getUpdates() {
    // Get all GNG Options
    const courses = await superagent.get('https://files.aero-nav.com/');
    let text = courses.text.split("Download Pages").pop();
    let textArray = text.split("\n");
    let liste = "";
    let firstElement = "<b>";
    let lastElement = "</b>";
    textArray.forEach(element => {
        if (element.includes(firstElement)) {
            liste += element.substring(
                    element.indexOf(firstElement) + firstElement.length,
                    element.indexOf(lastElement, element.indexOf(firstElement))) +
                "\n";
        }
    });
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
    getFiles();
}

async function getFiles() {
    removeFileItems();
    // Get all GNG Package Options
    let region = "https://files.aero-nav.com/" + dropDownGNG.options[dropDownGNG.selectedIndex].text;
    let courses = await superagent.get(region);
    let text = courses.text.split("Released</th><th colspan='2'>Download</th></tr>").pop();
    text = text.split("<h1>AIRAC <small>News</small></h1>")[0];
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
    //console.log(rows); // For debugging only

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

    let firstElement = "href=";
    let lastElement = "class=";
    let hrefLinksList = "";
    for (var i = 4; i < listeArray.length; i = i + 5) {
        hrefLinksList += listeArray[i].substring(
            listeArray[i].indexOf(firstElement) + firstElement.length + 1,
            listeArray[i].indexOf(lastElement) - 2) + "\n";
    }
    const hrefLinksArray = hrefLinksList.split("\n");
    hrefLinksArray.pop();

    // Add Elements to Drop Down
    for (let i = 0; i < fileNamesArray.length; i++) {
        var option = document.createElement("option");
        option.text = fileNamesArray[i];
        option.href = hrefLinksArray[i];
        dropDownFiles.add(option);
    }

    return hrefLinksArray;
}


function downloadFile(source, path) {
    console.log(source)
    const zipFile = source.split('/').pop();

    superagent
        .get(source).set("Referer", "http://files.aero-nav.com/")
        .on('error', function(error) {
            console.log(error);
        })
        .pipe(fs.createWriteStream(path + "\\" + zipFile))
        .on('finish', function() {
            // add code below to here
        });
}

// Unzip file
function decompress(url, DESTINATION_PATH) {
    let file = url.split('/').pop()
    var ZIP_FILE_PATH = DESTINATION_PATH + "\\" + file;
    DESTINATION_PATH += "\\" + file.split('.')[0];
    console.log(DESTINATION_PATH)
    var unzipper = new DecompressZip(ZIP_FILE_PATH);

    // Add the error event listener
    unzipper.on('error', function(err) {
        console.log('Caught an error', err);
    });

    // Notify when everything is extracted
    unzipper.on('extract', function(log) {
        console.log('Finished extracting', log);
    });

    // Notify "progress" of the decompressed files
    unzipper.on('progress', function(fileIndex, fileCount) {
        document.getElementById('progressbar').value = (0.5 + ((fileIndex + 1) / fileCount) / 2) * 100
        console.log(0.5 + ((fileIndex + 1) / fileCount) / 2);
    });

    // Start extraction of the content
    unzipper.extract({
        path: DESTINATION_PATH
    });
}



function changeUserpath() {
    ipcRenderer.send('app-path');
}

ipcRenderer.on("app-path", (event, value) => {
    systemstructure.path = value[0];
    fs.writeFileSync(systemstructure.path + "\\" + settings, JSON.stringify(structure, null, 4), 'utf8');
})

ipcRenderer.on("download progress", (event, progress) => {
    const cleanProgressInPercentages = Math.floor(progress.percent * 100); // Without decimal point
    document.getElementById('progressbar').value = cleanProgressInPercentages;
});

// let downloadBtn = document.getElementById('download');
// downloadBtn.addEventListener('click', (e) => {
//     var systemReadJson = JSON.parse(fs.readFileSync(systempath, 'utf8'));
//     var userReadJson = JSON.parse(fs.readFileSync(systemReadJson.path + userFile, 'utf8'));
//     downloadFile(files.options[files.selectedIndex].href, systemReadJson.path);
// });
let testBtn = document.getElementById('test');
testBtn.addEventListener('click', (e) => {
    var systemReadJson = JSON.parse(fs.readFileSync(systempath, 'utf8'));
    var userReadJson = JSON.parse(fs.readFileSync(systemReadJson.path + userFile, 'utf8'));
    decompress(files.options[files.selectedIndex].href, systemReadJson.path)
});