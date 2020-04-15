const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');


function initialiseApp() {
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1332,
    height: 1080,
    webPreferences: {
      allowRunningInsecureContent: true,
      nodeIntegration: true,
    }
  });

  mainWindow.loadFile('index.html');

  // mainWindow.webContents.openDevTools();
}

let updateWindow;

function createUpdateWindow() {
  updateWindow = new BrowserWindow();
  updateWindow.on('closed', () => { updateWindow = null });

  updateWindow.loadFile('update.html');
  return updateWindow;
}

function sendStatusToWindow(text) {
  log.info(text);
  updateWindow.webContents.send('message', text);
}

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available, downloading...');
  updateWindow.webContents.send('version', app.getVersion());
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Failed to download update: ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded, please restart to get new version');
});

app.whenReady().then(initialiseApp);

app.on('window-all-closed', function () {
  app.quit();
});
