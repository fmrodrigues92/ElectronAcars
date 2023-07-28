const { ipcRenderer } = require('electron')

ipcRenderer.on('updateData', (event, data) => {
    for (const [key, value] of Object.entries(data)) {
        document.getElementById(key).value = value;
    }
});