import {CopyOptionHandler, CopyOptions} from "../utils/CopyOptionHandler";
import {processFile} from "./ProcessFile";
import path from "path";
import {processDirectory} from "./ProcessDirectory";
import {IFileHandler, IIgnoreList, ILogger, IUserInterface} from "../types/interfaces";

export async function startCopyingProcess(
  directoryPath: string,
  option: CopyOptions,
  fileHandler: IFileHandler,
  ui: IUserInterface,
  ignoreList: IIgnoreList,
  logger: ILogger
): Promise<string> {
  logger.info(`Starting copy process for directory: "${directoryPath}" with option: "${option}"`);

  const initialStat = await fileHandler.stat(directoryPath);
  let result;

  if (initialStat.isFile()) {
    result = await processFile(directoryPath, path.basename(directoryPath), option, 0, true, fileHandler, logger);
  } else {
    result = await processDirectory(directoryPath, directoryPath, option, 0, fileHandler, logger, ui, ignoreList);
  }

  const content = CopyOptionHandler.buildContent(
    directoryPath,
    result.structure,
    result.ignored,
    [],  // Assuming no additional file content needed
    option
  );

  return content;  // Return the content instead of copying it
}
