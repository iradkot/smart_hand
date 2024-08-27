import { CopyOptions } from "./CopyOptionHandler";
import { createIndentationString } from "./CreateIndentationString";
import { logger } from "../../utils/Logger"; // import logger directly
import path from "path";
import { FileOrFolder, IFileHandler } from "../../types/interfaces";

export async function processFile(
  itemPath: string,
  relativeItemPath: string,
  option: CopyOptions,
  depth: number,
  isLast: boolean,
  fileHandler: IFileHandler
): Promise<{ structure: string[], ignored: string[], filesAndFolders: FileOrFolder[], resultDict: Record<string, any> }> {
  const prefix = createIndentationString(depth, isLast);
  const fileName = path.basename(itemPath);
  logger.debug(`Processing file: ${itemPath}`);

  const folderStructure = [`${prefix}${fileName}\n`];
  const fileContent = option === CopyOptions.CopyFileContents ? await fileHandler.readFile(itemPath) : null;
  const fileEntries = fileContent ? [`${relativeItemPath}\n${fileContent}\n`] : [];

  const filesAndFolders: FileOrFolder[] = [{
    relativePath: relativeItemPath,
    isFile: true,
    content: fileContent,
  }];

  const resultDict: Record<string, any> = {
    [fileName]: {
      type: 'file',
      content: fileContent,
    }
  };

  return { structure: folderStructure, ignored: fileEntries, filesAndFolders, resultDict };
}
