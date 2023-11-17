

export const invokeCopyingProcess = async ({ directoryPath, option }) => {
  window.electron.ipcRenderer.send('invoke-copying-process', directoryPath, option)
}
