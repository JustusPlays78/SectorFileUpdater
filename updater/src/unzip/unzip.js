var ZIP_FILE_PATH = "C:/path/to/file/myzipfile.zip";
var DESTINATION_PATH = "C:/desktop/examplefolder";
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
    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
});

// Start extraction of the content
unzipper.extract({
    path: DESTINATION_PATH
        // You can filter the files that you want to unpack using the filter option
        //filter: function (file) {
        //console.log(file);
        //return file.type !== "SymbolicLink";
        //}
});