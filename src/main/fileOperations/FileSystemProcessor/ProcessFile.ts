import {CopyOptions} from "../utils/CopyOptionHandler";
import {createIndentationString} from "./CreateIndentationString";
import path from "path";
import {IFileHandler, ILogger} from "../types/interfaces";

export async function processFile(
  itemPath: string,
  relativeItemPath: string,
  option: CopyOptions,
  depth: number,
  isLast: boolean,
  fileHandler: IFileHandler,
  logger: ILogger
): Promise<{ structure: string[], ignored: string[] }> {
  const prefix = createIndentationString(depth, isLast);
  const fileName = path.basename(itemPath);
  logger.debug(`Processing file: ${itemPath}`);

  const folderStructure = [`${prefix}${fileName}\n`];
  const fileEntries = option === CopyOptions.CopyFileContents
    ? [`${relativeItemPath}\n${await fileHandler.readFile(itemPath)}\n`]
    : [];

  return { structure: folderStructure, ignored: fileEntries };
}
