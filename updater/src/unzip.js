// Unzip file
function decompress(url, DESTINATION_PATH) {
    let file = url.split('/').pop();
    var ZIP_FILE_PATH = DESTINATION_PATH + "\\" + file;
    DESTINATION_PATH += "\\" + file.split('.')[0];
    console.log(DESTINATION_PATH);
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