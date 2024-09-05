import {
  COPYING_PROCESS_INVOKE,
  CREATE_AND_RUN_TEST_INVOKE,
  READ_PACKAGE_JSON_INVOKE
} from "./constants";


export const invokeCopyingProcess = async ({ directoryPath, option }) => {
  return window.electron.ipcRenderer
    .invoke(COPYING_PROCESS_INVOKE, directoryPath, option);
}

export const invokeCreateAndRunTest = async ({ sessionId, directoryPath, fileContent, instructions }) => {
  return window.electron.ipcRenderer.invoke(CREATE_AND_RUN_TEST_INVOKE, sessionId, directoryPath, fileContent, instructions);
};

export const invokeReadPackageJson = (directoryPath: string) => {
  return window.electron.ipcRenderer.invoke(READ_PACKAGE_JSON_INVOKE, directoryPath);
};
