const { app, BrowserWindow } = require('electron')
const path = require('path')
const fsuipc = require('fsuipc');

const obj = new fsuipc.FSUIPC();
let win; 

const createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: true
        }
    })

    win.loadFile('src/pages/index.html')
}

app.whenReady().then(() => {
    createWindow();
})

const startFSUIPC = () => {
  setInterval(() => {

      obj.open()
        .then((obj) => {
          obj.add('IAS', 0x2BC, fsuipc.Type.Int64);
          obj.add('Altitude', 0x3324, fsuipc.Type.Int32);

          return obj.process();
        })
        .then((result) => {

          let ias = parseInt(result.IAS / 128) + ' kts';
          let altitude = result.Altitude + ' ft';

          // console.log('IAS: ' + ias + ' | Altitude: ' + altitude);
          win.webContents.send('updateData', {'ias': ias, 'altitude': altitude});
    

          return obj.close();
        })
        .catch((err) => {
          console.error(err);
          
          return obj.close();
        });

  }, 300);

}

startFSUIPC();


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})