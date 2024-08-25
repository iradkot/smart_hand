import { CopyOptions } from "../../utils/CopyOptionHandler";
import { createIndentationString } from "./CreateIndentationString";
import { logger } from "../../utils/Logger"; // import logger directly
import path from "path";
import {FileOrFolder, IFileHandler} from "../../types/interfaces";

export async function processFile(
  itemPath: string,
  relativeItemPath: string,
  option: CopyOptions,
  depth: number,
  isLast: boolean,
  fileHandler: IFileHandler
): Promise<{ structure: string[], ignored: string[], filesAndFolders: FileOrFolder[] }> {
  const prefix = createIndentationString(depth, isLast);
  const fileName = path.basename(itemPath);
  logger.debug(`Processing file: ${itemPath}`);

  const folderStructure = [`${prefix}${fileName}\n`];
  const fileEntries = option === CopyOptions.CopyFileContents
    ? [`${relativeItemPath}\n${await fileHandler.readFile(itemPath)}\n`]
    : [];

  const filesAndFolders: FileOrFolder[] = [{
    relativePath: relativeItemPath,
    isFile: true,
    content: fileEntries.length > 0 ? fileEntries.join('') : null,
  }];

  return { structure: folderStructure, ignored: fileEntries, filesAndFolders };
}
