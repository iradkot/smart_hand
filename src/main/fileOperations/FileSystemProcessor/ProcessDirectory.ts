import {CopyOptions} from "../utils/CopyOptionHandler";
import {createIndentationString} from "./CreateIndentationString";
import path from "path";
import {processFile} from "./ProcessFile";
import {IFileHandler, IIgnoreList, ILogger, IUserInterface} from "../types/interfaces";


export async function processDirectory(
  directoryPath: string,
  initialDirectoryPath: string,
  option: CopyOptions,
  depth: number,
  fileHandler: IFileHandler,
  logger: ILogger,
  ui: IUserInterface,
  ignoreList: IIgnoreList
): Promise<{ structure: string[], ignored: string[] }> {
  const prefix = createIndentationString(depth, false);
  const folderName = path.basename(directoryPath);
  let folderStructure = [`${prefix}${folderName}/\n`];
  let ignoredFiles: string[] = [];

  const copyContents = await ui.confirm(`Do you want to copy the contents of the folder? ${path.relative(initialDirectoryPath, directoryPath)}`);

  if (!copyContents) {
    return { structure: folderStructure, ignored: ignoredFiles };
  }

  const items = await fileHandler.readDir(directoryPath);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemPath = path.join(directoryPath, item);
    const relativeItemPath = path.relative(initialDirectoryPath, itemPath);
    const isLast = i === items.length - 1;

    if (ignoreList.shouldIgnore(itemPath)) {
      ignoredFiles.push(`${createIndentationString(depth + 1, isLast)}${relativeItemPath}/\n`);
      continue;
    }

    const itemStat = await fileHandler.stat(itemPath);
    if (itemStat.isFile()) {
      const { structure, ignored } = await processFile(itemPath, relativeItemPath, option, depth + 1, isLast, fileHandler, logger);
      folderStructure = folderStructure.concat(structure);
      ignoredFiles = ignoredFiles.concat(ignored);
    } else if (itemStat.isDirectory()) {
      const { structure, ignored } = await processDirectory(itemPath, initialDirectoryPath, option, depth + 1, fileHandler, logger, ui, ignoreList);
      folderStructure = folderStructure.concat(structure);
      ignoredFiles = ignoredFiles.concat(ignored);
    }
  }

  return { structure: folderStructure, ignored: ignoredFiles };
}
