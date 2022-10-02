const { app, BrowserWindow, Menu, dialog, ipcMain, nativeTheme } = require('electron');
const { download } = require("electron-dl");
const path = require('path');
//Menu.setApplicationMenu(false);
var fs = require('fs');
let window;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
    app.quit();
}


async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}
app.whenReady(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow()
})

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
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


ipcMain.on('select-dirs', async(event, arg) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    })
    console.log('directories selected', result.filePaths)
})


// Download a file
ipcMain.on("download", async(event, url) => {
    //properties.onProgress = status => window.webContents.send("download progress", status);
    download(BrowserWindow.getFocusedWindow(), url)
        .then(dl => window.webContents.send("download complete", dl.getSavePath()));
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.