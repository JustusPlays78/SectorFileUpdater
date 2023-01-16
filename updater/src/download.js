const unzipper = require('unzipper');

var airacversion = "";
var releaseversion = "";
var region = "";

function downloadFile(source) {
    saveDownloadInfo(dropDownFiles.options[dropDownFiles.selectedIndex].version);
    let startpath = systemstructure.path;
    airacversion = structure.currentInstalledAirac;
    releaseversion = structure.version;
    region = gng.options[gng.selectedIndex].text;
    const zipFile = source.split('/').pop();
    const templatePath = `${startpath}\\config`;
    const comparedPath = `${startpath}\\${region}\\${airacversion}_v${releaseversion}`;
    // Code to save download info and create local structure

    let progress = 0;
    ipcRenderer.send('download-progress', { progress });

    const request = superagent
        .get(source)
        .set("Referer", "http://files.aero-nav.com/")
        .on('error', function(error) {
            console.log(error);
        });

    request.on('response', res => {
        const total = parseInt(res.headers['content-length'], 10);
        res.on('data', chunk => {
            progress += chunk.length;
            const percent = (progress / total * 100).toFixed(2);
            ipcRenderer.send('download-progress', { progress: percent });
        });
    });

    request
        .pipe(fs.createWriteStream(startpath + "\\" + zipFile))
        .on('finish', function() {
            // Code to extract file
            fs.createReadStream(startpath + "\\" + zipFile)
                .pipe(unzipper.Extract({ path: `${startpath}/${region}/${airacversion}_v${releaseversion}` }))
                .on('finish', function() {
                    console.log("Decompressed successfully.");
                    compareFolders(templatePath, comparedPath, startpath);
                });
        });
}

function createFolder(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
};

function createLocalStructure() {
    const airacversion = structure.currentInstalledAirac;
    const releaseversion = structure.version;
    const region = gng.options[gng.selectedIndex].text;

    createFolder('config');
    createFolder(`${region}`);
    createFolder(`${region}/${airacversion}_v${releaseversion}`);
}