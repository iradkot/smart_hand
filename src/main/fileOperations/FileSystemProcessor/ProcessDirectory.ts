import path from 'path';
import { IFileHandler, IUserInterface, IIgnoreList, FileOrFolder } from '../types/interfaces';
import { createIndentationString } from "./CreateIndentationString";
import { processFile } from "./ProcessFile";
import { CopyOptions } from "../utils/CopyOptionHandler";

export async function processDirectory(
  currentDirectoryPath: string,
  initialDirectoryPath: string,
  option: CopyOptions,
  depth: number,
  fileHandler: IFileHandler,
  ui: IUserInterface,
  ignoreList: IIgnoreList
): Promise<{ structure: string[], ignored: string[], filesAndFolders: FileOrFolder[] }> {
  const indentation = createIndentationString(depth, false);
  const folderName = path.basename(currentDirectoryPath);
  let folderStructure: string[] = [];
  let ignoredFiles: string[] = [];
  let filesAndFolders: FileOrFolder[] = [];

  try {
    // Add the folder name to the structure regardless of copying contents
    folderStructure.push(`${indentation}${folderName}/\n`);
    filesAndFolders.push({ relativePath: path.relative(initialDirectoryPath, currentDirectoryPath), isFile: false });

    const copyContents = await ui.confirm(`Do you want to copy the contents of the folder? ${path.relative(initialDirectoryPath, currentDirectoryPath)}`);

    if (!copyContents) {
      ignoredFiles.push(`${indentation}${folderName}/\n`);
      return { structure: folderStructure, ignored: ignoredFiles, filesAndFolders };
    }

    const items = await fileHandler.readDir(currentDirectoryPath);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPath = path.join(currentDirectoryPath, item);
      const relativeItemPath = path.relative(initialDirectoryPath, itemPath);
      const isLast = i === items.length - 1;

      if (ignoreList.shouldIgnore(itemPath)) {
        ignoredFiles.push(`${createIndentationString(depth + 1, isLast)}${relativeItemPath}/\n`);
        continue;
      }

      const itemStat = await fileHandler.stat(itemPath);
      if (itemStat.isFile()) {
        const { structure, ignored, filesAndFolders: fileResult } = await processFile(itemPath, relativeItemPath, option, depth + 1, isLast, fileHandler);
        folderStructure = folderStructure.concat(structure);
        ignoredFiles = ignoredFiles.concat(ignored);
        filesAndFolders = filesAndFolders.concat(fileResult);
      } else if (itemStat.isDirectory()) {
        const { structure, ignored, filesAndFolders: dirResult } = await processDirectory(itemPath, initialDirectoryPath, option, depth + 1, fileHandler, ui, ignoreList);
        folderStructure = folderStructure.concat(structure);
        ignoredFiles = ignoredFiles.concat(ignored);
        filesAndFolders = filesAndFolders.concat(dirResult);
      }
    }

    return { structure: folderStructure, ignored: ignoredFiles, filesAndFolders };
  } catch (error) {
    console.error(`Error processing directory ${currentDirectoryPath}:`, error);
    return { structure: folderStructure, ignored: ignoredFiles, filesAndFolders };
  }
}
