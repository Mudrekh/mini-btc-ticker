const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, ws;
console.log('Starting Application');

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 250, height: 30, x: 0, y: 0 });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // win.webContents.openDevTools();
  win.setAlwaysOnTop(true);
  // Emitted when the window is closed.
  // win.loadURL('https://www.gdax.com/trade');
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

function connectGDAX() {
  console.log('Connecting to GDAX');
  let WebSocket = require('ws');
  ws = new WebSocket('wss://ws-feed.gdax.com');
  ws.on('message', (data, flags) => {
    // flags.binary will be set if a binary data is received
    // flags.masked will be set if the data was masked
    let obj = JSON.parse(data);
    if (obj.price) {
      win.webContents.send('price', obj.price);
    }
  });
  ws.on('open', () => {
    ws.send(JSON.stringify({
      'type': 'subscribe',
      'product_ids': ['BTC-USD'],
      'channels': ['ticker']
    }));
  });
  process.on('SIGTERM', ws.terminate);
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  connectGDAX();
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
    ws.terminate();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

process.on('error', console.log);