import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  saveFile: (filename: string, content: string) => ipcRenderer.invoke('save-file', filename, content),
  listFiles: () => ipcRenderer.invoke('list-files'),
  readFile: (filename: string) => ipcRenderer.invoke('read-file', filename),
});