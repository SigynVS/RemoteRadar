const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const db = require('./lib/db');
const scheduler = require('./lib/scheduler');

const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'default',
    title: 'RemoteRadar',
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist-react', 'index.html'));
  }
}

app.whenReady().then(() => {
  db.init();
  createWindow();
  scheduler.start(mainWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
ipcMain.handle('jobs:get', (_, filters) => {
  return db.getJobs(filters);
});

ipcMain.handle('jobs:fetch-now', async () => {
  const { fetchAll } = require('./lib/fetcher');
  const newCount = await fetchAll(db);
  return newCount;
});

ipcMain.handle('jobs:mark-seen', (_, id) => {
  return db.markSeen(id);
});

ipcMain.handle('jobs:mark-applied', (_, id) => {
  return db.markApplied(id);
});

ipcMain.handle('jobs:dismiss', (_, id) => {
  return db.dismissJob(id);
});

ipcMain.handle('settings:get', () => {
  return db.getSettings();
});

ipcMain.handle('settings:save', (_, settings) => {
  return db.saveSettings(settings);
});

// Called by scheduler when new jobs arrive
global.notifyNewJobs = (count) => {
  if (Notification.isSupported()) {
    new Notification({
      title: 'RemoteRadar',
      body: `${count} new job${count > 1 ? 's' : ''} match your filters!`,
    }).show();
  }
  if (mainWindow) {
    mainWindow.webContents.send('jobs:new', count);
  }
};
