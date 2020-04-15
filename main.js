const { app, BrowserWindow } = require('electron');

function initialiseApp() {
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
app.whenReady().then(initialiseApp);

app.on('window-all-closed', function () {
  app.quit();
});
