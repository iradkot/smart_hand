export enum CopyOptions {
  CopyFileContents = '1',
  OnlyCopyStructure = '2',
}

export class CopyOptionHandler {
  static buildContentForFile(filePath: string, fileContent: string, option: CopyOptions): string {
    return option === CopyOptions.CopyFileContents
      ? `The following is the content of the file "${filePath}":\n\n${fileContent}`
      : `The path of the file is: "${filePath}"`;
  }

  static buildContent(
    directoryPath: string,
    folderStructure: string[],
    ignoredFiles: string[],
    fileEntries: string[],
    option: CopyOptions
  ): string {
    const baseContent = [
      `The following is the structure of the folder "${directoryPath}":\n`,
      ...folderStructure,
      '\nThe following are the ignored files and folders:\n',
      ...ignoredFiles,
    ].join('');

    return option === CopyOptions.CopyFileContents
      ? [baseContent, '\nThe following is the content of files with their paths relative to the base folder:\n', ...fileEntries].join('')
      : baseContent;
  }
}
