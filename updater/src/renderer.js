const { ipcRenderer, dialog } = require('electron');
const superagent = require('superagent').agent();
var fs = require('fs');
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

let downloadBtn = document.getElementById('download');
downloadBtn.addEventListener('click', (e) => {
    var systemReadJson = JSON.parse(fs.readFileSync(systempath, 'utf8'));
    var userReadJson = JSON.parse(fs.readFileSync(systemReadJson.userpath + userFile, 'utf8'));
    downloadFile(files.options[files.selectedIndex].href, systemReadJson.userpath);
});
let directoryBtn = document.getElementById('dirs');
directoryBtn.addEventListener('click', (e) => {});
ipcRenderer.on("filepath", (event, file) => {
    document.getElementById('dirBox').value = file;
});

let testBtn = document.getElementById('test');
testBtn.addEventListener('click', (e) => {
    var systemReadJson = JSON.parse(fs.readFileSync(systempath, 'utf8'));
    var userReadJson = JSON.parse(fs.readFileSync(systemReadJson.userpath + userFile, 'utf8'));
    decompress(files.options[files.selectedIndex].href, systemReadJson.userpath)
});

// Save Event
gng.addEventListener("change", () => {
    getFiles();
    save();
});
files.addEventListener("change", () => {
    save();
});

let save = () => {
    var systemReadJson = JSON.parse(fs.readFileSync(systempath, 'utf8'));
    var userReadJson = JSON.parse(fs.readFileSync(systemReadJson.userpath + userFile, 'utf8'));
    userReadJson.region = gng.selectedIndex;
    userReadJson.file = files.selectedIndex;
    fs.writeFile(systemReadJson.userpath + userFile, JSON.stringify(userReadJson), function(err) {
        if (err) throw err;
    });
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
const removeFileItems = () => {
    var i, L = dropDownFiles.options.length - 1;
    for (i = L; i >= 0; i--) {
        dropDownFiles.remove(i);
    }
}

const getUpdates = async() => {


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

// Check Files
let getFilesBtn = document.getElementById('getFiles');
getFilesBtn.addEventListener('click', (e) => {
    hrefLinks = getFiles();
    console.log("leaveme alone " + hrefLinks);
});

const getFiles = async() => {
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


let downloadFile = (source, path) => {
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
let decompress = (url, DESTINATION_PATH) => {
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