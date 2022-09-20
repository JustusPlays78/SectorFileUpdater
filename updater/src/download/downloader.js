const { app, BrowserWindow, ipcMain } = require("electron");
const { download } = require("electron-dl");
let window;
app.on("ready", () => {
    window = new BrowserWindow({
        width: someWidth,
        height: someHeight
    });
    window.loadURL(`file://${__dirname}/index.html`);
    ipcMain.on("download", (event, info) => {
        download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
            .then(dl => window.webContents.send("download complete", dl.getSavePath()));
    });
});


ipcMain.on("download", (event, info) => {
    info.properties.onProgress = status => window.webContents.send("download progress", status);
    download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
        .then(dl => window.webContents.send("download complete", dl.getSavePath()));
});