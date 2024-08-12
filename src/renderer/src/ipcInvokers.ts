import {COPYING_PROCESS_INVOKE} from "../../constants";


export const invokeCopyingProcess = async ({ directoryPath, option }) => {
  window.electron.ipcRenderer.send(COPYING_PROCESS_INVOKE, directoryPath, option)
}
