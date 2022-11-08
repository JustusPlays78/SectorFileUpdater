const { ipcRenderer, dialog } = require('electron');
const superagent = require('superagent').agent();
var fs = require('fs');

// Global Variabels
let hrefLinks = "";


ipcRenderer.on("download complete", (event, file) => {
    console.log(file); // Full file path
    // Datei entpacken
});

ipcRenderer.on("download progress", (event, progress) => {
    const cleanProgressInPercentages = Math.floor(progress.percent * 100); // Without decimal point
    document.getElementById('progressbar').value = cleanProgressInPercentages;
});

let fileSelect = document.getElementById('files');
let donwloadBtn = document.getElementById('download');
donwloadBtn.addEventListener('click', (e) => {
    let directoryPath = document.getElementById('dirBox');
    let urlPath = document.getElementById('urlBox');
    ipcRenderer.send("download", {
        url: hrefLinks[fileSelect.options.selectedIndex],
        properties: {
            directory: directoryPath.value
        }
    });
});

let directoryBtn = document.getElementById('dirs');
directoryBtn.addEventListener('click', (e) => {
    ipcRenderer.send('select-dirs');
});

ipcRenderer.on("filepath", (event, file) => {
    document.getElementById('dirBox').value = file;
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
    text = text.split("<h1>AIRAC <small>News</small></h1>")[0]
        //console.log(text);
    let rows = "";

    // As an idea

    // textArray = text.split("\n");
    // let liste = "";
    // let firstElement = "<td>";
    // let lastElement = "</td>";
    // textArray.forEach(element => {
    //     if (element.includes(firstElement)) {
    //         liste += element.substring(
    //                 element.indexOf(firstElement) + firstElement.length,
    //                 element.indexOf(lastElement, element.indexOf(firstElement))) +
    //             "\n";
    //     }
    // });
    // let outArray2 = liste.split("\n");
    // outArray2.pop();
    // console.log(outArray2);

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
    fileNamesArray.forEach(optionsAdd);

    // Add Elements to Drop Down
    function optionsAdd(item) {
        var option = document.createElement("option");
        option.text = item;
        dropDownFiles.add(option);
    }

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

    console.log(hrefLinksArray);
    return hrefLinksArray;
}






// Download idea from https://damieng.com/blog/2017/03/10/downloading-files-with-progress-in-electron/

download("https://files.aero-nav.com/EDGG/Full_Package_20221104183433-221101-3.zip", "Full_Package_20221104183433-221101-3.zip", (bytes, percent) => console.log(`Downloaded ${bytes} (${percent})`));


//import fs from "fs";

async function download(
    sourceUrl,
    targetFile,
    progressCallback,
    length
) {
    const request = new Request(sourceUrl, {
        headers: new Headers({ "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.5", "Accept-Encoding": "gzip, deflate, br", "DNT": "1", "Connection": "keep-alive", "Referer": "http://files.aero-nav.com/", "Upgrade-Insecure-Requests": "1", "Sec-Fetch-Dest": "document", "Sec-Fetch-Mode": "navigate", "Sec-Fetch-Site": "cross-site", "Sec-Fetch-User": "?1" }),
    });

    const response = await fetch(request);
    if (!response.ok) {
        throw Error(
            `Unable to download, server returned ${response.status} ${response.statusText}`
        );
    }

    const body = response.body;
    if (body == null) {
        throw Error("No response body");
    }

    const finalLength =
        length || parseInt(response.headers.get("Content-Length" || "0"), 10);
    const reader = body.getReader();
    const writer = fs.createWriteStream(targetFile);

    await streamWithProgress(finalLength, reader, writer, progressCallback);
    writer.end();
}

async function streamWithProgress(length, reader, writer, progressCallback) {
    let bytesDone = 0;

    while (true) {
        const result = await reader.read();
        if (result.done) {
            if (progressCallback != null) {
                progressCallback(length, 100);
            }
            return;
        }

        const chunk = result.value;
        if (chunk == null) {
            throw Error("Empty chunk received during download");
        } else {
            writer.write(Buffer.from(chunk));
            if (progressCallback != null) {
                bytesDone += chunk.byteLength;
                const percent =
                    length === 0 ? null : Math.floor((bytesDone / length) * 100);
                progressCallback(bytesDone, percent);
            }
        }
    }
}



// Git Operations

// Vars for git
const options = { compareSize: true, compareContent: true, compareFileAsync: true };
const path1 = 'E:\\git\\v1';
const path2 = 'E:\\git\\v2';

let gitBtn = document.getElementById('git');
gitBtn.addEventListener('click', (e) => {
    git();
});

const git = async() => {
    const res = dircompare.compareSync(path1, path2, options);
    console.log(res.differencesFiles); // Number check :)
    print(res);
}

function print(result) {
    //console.log('Directories are %s', result.same ? 'identical' : 'different')

    //console.log('Statistics - equal entries: %s, distinct entries: %s, left only entries: %s, right only entries: %s, differences: %s', result.equal, result.distinct, result.left, result.right, result.differences)

    let oldFolder, newFolder, other;
    result.diffSet.forEach(function(dif) {
        if (dif.state !== "equal") {
            console.log('Difference - name1: %s, type1: %s, name2: %s, type2: %s, state: %s',
                dif.name1, dif.type1, dif.name2, dif.type2, dif.state);
            if (dif.state === "right") {
                newFolder += dif.name2 + "\n";
            } else if (dif.state === "left") {
                oldFolder += dif.name1 + "\n";
            } else {
                other += dif.name1 + "\n";
            }
        }
    });

    console.log(newFolder);
    console.log(oldFolder);
    console.log(other);
}