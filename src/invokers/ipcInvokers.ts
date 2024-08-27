import {COPYING_PROCESS_INVOKE, CREATE_AND_RUN_TEST_INVOKE} from "./constants";


export const invokeCopyingProcess = async ({ directoryPath, option }) => {
  return window.electron.ipcRenderer
    .invoke(COPYING_PROCESS_INVOKE, directoryPath, option);
}

// Add the invoker for "Create and Run Test"
export const invokeCreateAndRunTest = async ({ sessionId, directoryPath, fileContent, instructions }) => {
  return window.electron.ipcRenderer.invoke(CREATE_AND_RUN_TEST_INVOKE, sessionId, directoryPath, fileContent, instructions);
};
