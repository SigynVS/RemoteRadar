const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('radar', {
  getJobs:     (filters) => ipcRenderer.invoke('jobs:get', filters),
  fetchNow:    ()        => ipcRenderer.invoke('jobs:fetch-now'),
  markSeen:    (id)      => ipcRenderer.invoke('jobs:mark-seen', id),
  markApplied: (id)      => ipcRenderer.invoke('jobs:mark-applied', id),
  dismiss:     (id)      => ipcRenderer.invoke('jobs:dismiss', id),
  getSettings: ()        => ipcRenderer.invoke('settings:get'),
  saveSettings:(s)       => ipcRenderer.invoke('settings:save', s),
  onNewJobs:   (cb)      => ipcRenderer.on('jobs:new', (_, count) => cb(count)),
});
