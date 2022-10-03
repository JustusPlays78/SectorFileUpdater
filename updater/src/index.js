const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { download } = require("electron-dl");
const path = require('path');
//Menu.setApplicationMenu(false); // Top Bar removal
var fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
    app.quit();
}

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

    // Select Directory
    ipcMain.on('select-dirs', async(event, arg) => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        })
        console.log('directories selected', result.filePaths)
    })

    // Download a file
    ipcMain.on("download", (event, info) => {
        // https://dms.pabr.de/s/SpBiQYADTNak7R5/download
        info.properties.onProgress = status => mainWindow.webContents.send("download progress", status);
        download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
            .then(dl => mainWindow.webContents.send("download complete", dl.getSavePath()));
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

// Write to a file
ipcMain.on("saveFile", (event, location, txtVal) => {
    fs.writeFile(location, txtVal.toString(), (err) => {
        if (!err) { console.log("File.written"); } else {
            console.log(err);
        }
    });
});