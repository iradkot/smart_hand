import path from 'path';
import {IFileHandler, IUserInterface, IIgnoreList, FileOrFolder, CopyOptions} from '../../types/interfaces';
import { createIndentationString } from "./CreateIndentationString";
import { processFile } from "./ProcessFile";
import {contentTree} from "../../../../types/pathHarvester.types";

export async function processDirectory(
  currentDirectoryPath: string,
  initialDirectoryPath: string,
  option: CopyOptions,
  depth: number,
  fileHandler: IFileHandler,
  ui: IUserInterface,
  ignoreList: IIgnoreList
): Promise<{ structure: string[], ignored: string[], filesAndFolders: FileOrFolder[], resultDict: contentTree }> {
  const isInitialDirectory = currentDirectoryPath === initialDirectoryPath;
  const indentation = createIndentationString(depth, false);
  const folderName = path.basename(currentDirectoryPath);
  let folderStructure: string[] = [];
  let ignoredFiles: string[] = [];
  let filesAndFolders: FileOrFolder[] = [];
  let resultDict: Record<string, any> = {};

  try {
    // Add the folder name to the structure regardless of copying contents
    folderStructure.push(`${isInitialDirectory ? '' : indentation}${folderName}/\n`);
    filesAndFolders.push({ relativePath: path.relative(initialDirectoryPath, currentDirectoryPath), isFile: false });

    resultDict[folderName] = {
      type: 'directory',
      children: {},
      localPath: currentDirectoryPath, // Assign the full local path here
    };

    // Only prompt for confirmation if it's not the initial directory
    if (!isInitialDirectory) {
      // const copyContents = await ui.confirm(`Do you want to copy the contents of the folder? ${path.relative(initialDirectoryPath, currentDirectoryPath)}`);
      //
      // if (!copyContents) {
      //   ignoredFiles.push(`${indentation}${folderName}/\n`);
      //   resultDict[folderName].children = false; // Indicate that children were not copied
      //   return { structure: folderStructure, ignored: ignoredFiles, filesAndFolders, resultDict };
      // }
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
        const { structure, ignored, filesAndFolders: fileResult, resultDict: fileDict } = await processFile(itemPath, relativeItemPath, option, depth + 1, isLast, fileHandler);
        folderStructure = folderStructure.concat(structure);
        ignoredFiles = ignoredFiles.concat(ignored);
        filesAndFolders = filesAndFolders.concat(fileResult);
        resultDict[folderName].children[item] = fileDict[item];
      } else if (itemStat.isDirectory()) {
        const { structure, ignored, filesAndFolders: dirResult, resultDict: dirDict } = await processDirectory(itemPath, initialDirectoryPath, option, depth + 1, fileHandler, ui, ignoreList);
        folderStructure = folderStructure.concat(structure);
        ignoredFiles = ignoredFiles.concat(ignored);
        filesAndFolders = filesAndFolders.concat(dirResult);
        resultDict[folderName].children[item] = dirDict[item];
      }
    }
    return { structure: folderStructure, ignored: ignoredFiles, filesAndFolders, resultDict };
  } catch (error) {
    console.error(`Error processing directory ${currentDirectoryPath}:`, error);
    return { structure: folderStructure, ignored: ignoredFiles, filesAndFolders, resultDict };
  }
}
