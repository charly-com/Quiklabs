import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs/promises';

let selectedFolder: string | null = null;

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: true,
          nodeIntegration: false,
          webSecurity: false, // Disable for local dev (enable in production)
        },
      });
  const url = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
  win.loadURL(url);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (!result.canceled && result.filePaths[0]) {
    selectedFolder = result.filePaths[0];
    return selectedFolder;
  }
  return null;
});

ipcMain.handle('save-file', async (_, filename: string, content: string) => {
  if (!selectedFolder) throw new Error('No folder selected');
  const filePath = path.join(selectedFolder, `${filename}.txt`);
  await fs.writeFile(filePath, content);
});

ipcMain.handle('list-files', async () => {
  if (!selectedFolder) throw new Error('No folder selected');
  const files = await fs.readdir(selectedFolder);
  return files.filter((file) => file.endsWith('.txt'));
});

ipcMain.handle('read-file', async (_, filename: string) => {
  if (!selectedFolder) throw new Error('No folder selected');
  const filePath = path.join(selectedFolder, filename);
  return fs.readFile(filePath, 'utf-8');
});