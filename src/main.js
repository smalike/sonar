const electron = require('electron');
const path = require('path');

const remote = electron.remote;
const context = remote || electron;
const {app, BrowserWindow, Menu, session} = context;

function isDev() {
  return app.getPath('exe').includes('/node_modules/electron-prebuilt/');
}

const development = isDev();

if (development) {
  require('electron-reload')(__dirname, {
    ignored: /node_modules|[\/\\]\./
  });
}

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 710,
    height: 640,
    frame: true,
    transparent: false,
    icon: path.join(__dirname, './assets/images/icon.png'),
  });
  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', () => {
    win = null;
  });
  if (development) {
    win.webContents.openDevTools();
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
