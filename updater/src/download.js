function downloadFile(source, path) {
    console.log(source);
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

function createFolder(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
};