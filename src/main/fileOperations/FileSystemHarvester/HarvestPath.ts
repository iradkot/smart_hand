import { CopyOptionHandler, CopyOptions } from "./utils/CopyOptionHandler";
import { processFile } from "./utils/ProcessFile";
import path from "path";
import { processDirectory } from "./utils/ProcessDirectory";
import { IFileHandler, IIgnoreList, IUserInterface, StartCopyingProcessResult } from "../types/interfaces";
import { logger } from "../utils/Logger";
import { FileError, DirectoryError } from "../types/Errors";

/**
 * Harvests the content and structure of a specified path, either a file or directory,
 * based on the provided copy options, and returns a structured result.
 *
 * @param {string} directoryPath - The path to the file or directory to be processed.
 * @param {CopyOptions} option - The option defining how the file or directory content should be handled.
 * @param {IFileHandler} fileHandler - The interface for handling file operations such as reading and stat.
 * @param {IUserInterface} ui - The interface for interacting with the user, e.g., for confirmations.
 * @param {IIgnoreList} ignoreList - The list defining which files or directories should be ignored during the process.
 * @returns {Promise<StartCopyingProcessResult>} - The result of the harvesting process, including messages and structured data.
 * @throws Will throw an error if an unhandled exception occurs during the process.
 */
export async function harvestPath(
  directoryPath: string,
  option: CopyOptions,
  fileHandler: IFileHandler,
  ui: IUserInterface,
  ignoreList: IIgnoreList,
): Promise<StartCopyingProcessResult> {
  try {
    // Log the start of the process, specifying the directory and option chosen
    logger.info(`Starting copy process for directory: "${directoryPath}" with option: "${option}"`);

    // Get the initial stats for the provided path (whether it's a file or directory)
    const initialStat = await fileHandler.stat(directoryPath);
    let result;

    // Check if the path is a file
    if (initialStat.isFile()) {
      // Process the file and return the result
      result = await processFile(directoryPath, path.basename(directoryPath), option, 0, true, fileHandler);
    } else {
      // If it's a directory, recursively process the directory and return the result
      result = await processDirectory(directoryPath, directoryPath, option, 0, fileHandler, ui, ignoreList);
      console.log('result keys:', Object.keys(result));  // Debugging: Log the keys of the result object
    }

    // Build the content output based on the processed data and selected option
    const content = CopyOptionHandler.buildContent(
      result.structure,
      result.ignored,
      result.filesAndFolders,
      option
    );

    // Return the final structured result including a message
    return { message: `Processed ${result.filesAndFolders.length} files/folders`, ...content };
  } catch (err) {
    if (err instanceof FileError || err instanceof DirectoryError) {
      logger.error(`Handled specific error during process: ${err.message}`, err);
      throw new Error(`Specific error during processing: ${err.message}`);
    }

    logger.error(`Unhandled error during process: ${String(err)}`, err);
    throw new Error(`Unhandled error during processing: ${String(err)}`);
  }
}
