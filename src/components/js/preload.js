const { contextBridge, ipcRenderer } = require('electron')

process.once('loaded', () => {
    window.addEventListener('message', evt => {
        if (evt.data.type === 'settingsProfileDirselectbutton') {
            ipcRenderer.send('settingsProfileDirselectbutton')
        }
    })
})