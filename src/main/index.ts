import { app, BrowserWindow } from 'electron';
import path from 'path';
import { ipcMain, dialog } from 'electron';
import fs from 'fs/promises';

let selectedFolder: string | null = null;

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

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadURL('http://localhost:5173'); // Vite dev server
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});