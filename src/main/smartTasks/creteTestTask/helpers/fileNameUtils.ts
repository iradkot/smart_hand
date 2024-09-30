// src/main/smartTasks/createTestTask/helpers/fileNameUtils.ts

export function createTestFileName(fileName: string): string {
  return fileName.includes('.')
    ? fileName.replace(/(\.[^.]+)$/, '.test$1')
    : `${fileName}.test`;
}

export function updateTestFileName(testFileName: string, extension: string): string {
  return testFileName.replace(/(\.[^.]+)$/, `.${extension}`);
}
