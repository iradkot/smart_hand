import {COPYING_PROCESS_INVOKE} from "./constants";


export const invokeCopyingProcess = async ({ directoryPath, option }) => {
  return window.electron.ipcRenderer
    .invoke(COPYING_PROCESS_INVOKE, directoryPath, option);
}
