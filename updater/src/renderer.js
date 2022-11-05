const { ipcRenderer, dialog } = require('electron');
var DecompressZip = require('decompress-zip');
const dircompare = require('dir-compare');


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

let extractBtn = document.getElementById('extract');
extractBtn.addEventListener('click', () => {
    let directoryPath = document.getElementById('dirBox');
    let urlPath = document.getElementById('urlBox');
    ipcRenderer.send("extract", {
        url: urlPath.value,
        properties: { directory: directoryPath.value }
    });
});



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