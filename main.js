const { app, BrowserWindow } = require('electron');

function createWindow () {
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

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
});