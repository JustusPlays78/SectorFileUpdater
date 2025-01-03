const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('path');
Menu.setApplicationMenu(false); // Top Bar removal

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    //mainWindow.webContents.openDevTools();
    // Select Directory
    ipcMain.on('app-path', async(event, arg) => {
        filepath = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        mainWindow.webContents.send("app-dest", filepath.filePaths);
        // Save directory to file
    });
    ipcMain.on('download-progress', (event, args) => {
        mainWindow.webContents.send("progressbar", args);
    });
    ipcMain.on("app-path-get", (event) => {
        mainWindow.webContents.send("app-path-get", app.getAppPath());
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