const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("novelCopilotAPI", {
  completion: (params) => ipcRenderer.invoke("completion", params), // 调用主进程暴露的接口
  stream: (params) => ipcRenderer.invoke("stream", params), // 流式调用
  on: (channel, callback) => ipcRenderer.on(channel, callback)
});
