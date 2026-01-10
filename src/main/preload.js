const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getTransactions: () => ipcRenderer.invoke('db:getTransactions'),
  addTransaction: (transaction) => ipcRenderer.invoke('db:addTransaction', transaction),
  updateTransaction: (id, transaction) => ipcRenderer.invoke('db:updateTransaction', id, transaction),
  deleteTransaction: (id) => ipcRenderer.invoke('db:deleteTransaction', id),
});
