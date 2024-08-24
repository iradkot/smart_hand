import { CopyOptionHandler, CopyOptions } from "../utils/CopyOptionHandler";
import { processFile } from "./ProcessFile";
import path from "path";
import { processDirectory } from "./ProcessDirectory";
import {IFileHandler, IIgnoreList, IUserInterface, StartCopyingProcessResult} from "../types/interfaces";
import { logger } from "../utils/Logger";

import { FileError, DirectoryError } from "../types/Errors";  // Import custom error types

export async function startCopyingProcess(
  directoryPath: string,
  option: CopyOptions,
  fileHandler: IFileHandler,
  ui: IUserInterface,
  ignoreList: IIgnoreList,
): Promise<StartCopyingProcessResult> {
  try {
    logger.info(`Starting copy process for directory: "${directoryPath}" with option: "${option}"`);

    const initialStat = await fileHandler.stat(directoryPath);
    let result;

    if (initialStat.isFile()) {
      result = await processFile(directoryPath, path.basename(directoryPath), option, 0, true, fileHandler);
    } else {
      result = await processDirectory(directoryPath, directoryPath, option, 0, fileHandler, ui, ignoreList);
      console.log('result keys:', Object.keys(result));
    }

    const content = CopyOptionHandler.buildContent(
      result.structure,
      result.ignored,
      result.filesAndFolders,
      option
    );

    return { message: `Processed ${result.filesAndFolders.length} files/folders`, ...content };
  } catch (err) {
    // Handle specific error types
    if (err instanceof FileError || err instanceof DirectoryError) {
      logger.error(`Handled specific error during process: ${err.message}`, err);
      return { error: 'Specific error during processing', details: err.message };
    }

    // Handle generic errors
    logger.error(`Unhandled error during process: ${String(err)}`, err);
    throw err;  // Re-throw to be caught by the calling function
  }
}


