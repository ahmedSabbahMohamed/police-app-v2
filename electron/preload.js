const { contextBridge, ipcRenderer, app } = require('electron');
const path = require('path');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any APIs you want to expose to the renderer process here
  // For example:
  // sendMessage: (message) => ipcRenderer.send('message', message),
  // onMessage: (callback) => ipcRenderer.on('message', callback),
  
  // Get application paths
  getPath: (name) => {
    return app.getPath(name);
  },
  
  // Get database path
  getDatabasePath: () => {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'sqlite.db');
  }
}); 