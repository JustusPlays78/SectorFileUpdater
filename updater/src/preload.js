const { ipcRenderer } = require('electron')


// Change me for file save
document.addEventListener('DOMContentLoaded', function() {
    let writeFile = document.getElementById("writeFile");
    writeFile.addEventListener("click", () => {
        let txtBox = document.getElementById("txtBox");
        let txtval = txtBox.value;

        ipcRenderer.send("saveFile", "f:\\file1.txt", txtval);
    });
});

// Change me for file save //ex: https://dms.pabr.de/s/RPbgF4nmgeyigkn 
document.addEventListener('DOMContentLoaded', function() {
    let startDownload = document.getElementById("startDownload");
    startDownload.addEventListener("click", () => {
        let urlBox = document.getElementById("txtBox");
        let urlval = urlBox.value;
        let dirBox = document.getElementById("txtBox");
        let dirval = dirBox.value;
        ipcRenderer.send("download", {
            url: urlval,
            properties: { directory: dirval }
        });
    });
});




// Change me for select directory
process.once('loaded', () => {
    window.addEventListener('message', evt => {
        if (evt.data.type === 'select-dirs') {
            ipcRenderer.send('select-dirs')
        }
    });
});