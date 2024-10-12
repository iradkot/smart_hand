import path from 'path';
import { IFileHandler, IUserInterface, IIgnoreList, FileOrFolder, CopyOptions } from '../../types/interfaces';
import { createIndentationString } from "./CreateIndentationString";
import { processFile } from "./ProcessFile";
import { ContentTree } from "../../../../types/pathHarvester.types";
import { normalizePath } from '../../../utils/PathUtils'

export async function processDirectory(
  currentDirectoryPath: string,
  initialDirectoryPath: string,
  option: CopyOptions,
  depth: number,
  fileHandler: IFileHandler,
  ui: IUserInterface,
  ignoreList: IIgnoreList
): Promise<{ structure: string[], ignored: string[], filesAndFolders: FileOrFolder[], resultDict: ContentTree }> {
  // Normalize paths
  const normalizedCurrentPath = normalizePath(currentDirectoryPath);
  const normalizedInitialPath = normalizePath(initialDirectoryPath);

  const isInitialDirectory = normalizedCurrentPath === normalizedInitialPath;
  const indentation = createIndentationString(depth, false);
  const folderName = path.basename(normalizedCurrentPath);
  let folderStructure: string[] = [];
  let ignoredFiles: string[] = [];
  let filesAndFolders: FileOrFolder[] = [];
  let resultDict: Record<string, any> = {};

  try {
    // Add the folder name to the structure regardless of copying contents
    folderStructure.push(`${isInitialDirectory ? '' : indentation}${folderName}/\n`);
    filesAndFolders.push({ relativePath: path.relative(normalizedInitialPath, normalizedCurrentPath), isFile: false });

    resultDict[folderName] = {
      type: 'directory',
      children: {},
      localPath: normalizedCurrentPath, // Assign the full local path here
    };

    const items = await fileHandler.readDir(normalizedCurrentPath);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPath = path.join(normalizedCurrentPath, item);
      const relativeItemPath = path.relative(normalizedInitialPath, itemPath);
      const isLast = i === items.length - 1;

      if (ignoreList.shouldIgnore(itemPath)) {
        ignoredFiles.push(`${createIndentationString(depth + 1, isLast)}${relativeItemPath}/\n`);
        continue;
      }

      const itemStat = await fileHandler.stat(itemPath);
      if (itemStat.isFile()) {
        const { structure, ignored, filesAndFolders: fileResult, resultDict: fileDict } = await processFile(itemPath, relativeItemPath, option, depth + 1, isLast, fileHandler);
        folderStructure = folderStructure.concat(structure);
        ignoredFiles = ignoredFiles.concat(ignored);
        filesAndFolders = filesAndFolders.concat(fileResult);
        resultDict[folderName].children[item] = fileDict[item];
      } else if (itemStat.isDirectory()) {
        const { structure, ignored, filesAndFolders: dirResult, resultDict: dirDict } = await processDirectory(itemPath, normalizedInitialPath, option, depth + 1, fileHandler, ui, ignoreList);
        folderStructure = folderStructure.concat(structure);
        ignoredFiles = ignoredFiles.concat(ignored);
        filesAndFolders = filesAndFolders.concat(dirResult);
        resultDict[folderName].children[item] = dirDict[item];
      }
    }
    return { structure: folderStructure, ignored: ignoredFiles, filesAndFolders, resultDict };
  } catch (error) {
    console.error(`Error processing directory ${normalizedCurrentPath}:`, error);
    return { structure: folderStructure, ignored: ignoredFiles, filesAndFolders, resultDict };
  }
}
