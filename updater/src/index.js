const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { download } = require("electron-dl");
const path = require('path');
//Menu.setApplicationMenu(false); // Top Bar removal
var fs = require('fs');
const yaml = require('js-yaml');
var DecompressZip = require('decompress-zip');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
    app.quit();
}

var filepath;
let data = {
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



const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools();
    /*
        // Read system yaml
        try {
            let fileContents = fs.readFileSync('sectorfileUpdater.yaml', 'utf8');
            filepath = yaml.load(fileContents).folderPath;
        } catch (e) {

        }
        // Read config yaml
        try {
            let fileContents = fs.readFileSync(filepath + 'sectorfileUpdater.yaml', 'utf8');
            data = yaml.load(fileContents);

            console.log(data);
            console.log(data.cid.id);
        } catch (e) {
            console.log(e);
            ipcRenderer.send("savefile", {});
        }*/

    // Select Directory
    ipcMain.on('select-dirs', async(event, arg) => {
        filepath = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        })
        console.log('directories selected', filepath.filePaths)
        mainWindow.webContents.send("filepath", filepath.filePaths);
        // Save directory to file
    });

    // Download a file
    ipcMain.on("download", (event, info) => {
        // https://dms.pabr.de/s/SpBiQYADTNak7R5/download
        info.properties.onProgress = status => mainWindow.webContents.send("download progress", status);
        download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
            .then(dl => mainWindow.webContents.send("download complete", dl.getSavePath()));
    });


    // Write to a file
    ipcMain.on("saveFile", () => {
        let yamlStr = yaml.dump(data);
        fs.writeFileSync(filepath + 'sectorfileUpdater.yaml', yamlStr, 'utf8');
    });

    // Unzip content
    ipcMain.on("extract", () => {
        //console.log(directory.directoryPath);
        var unzipper = new DecompressZip("F:\\Desktop.zip");
        unzipper.extract({
            path: "F:\\test\\" // directory.directoryPath
        });
        // Notify "progress" of the decompressed files
        unzipper.on('progress', function(fileIndex, fileCount) {
            console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
        });
        // Notify when everything is extracted
        unzipper.on('extract', function(log) {
            console.log('Finished extracting', log);
        });
    });
};






// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    let yamlStr = yaml.dump(data);
    fs.writeFileSync('data-out.yaml', yamlStr, 'utf8');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});