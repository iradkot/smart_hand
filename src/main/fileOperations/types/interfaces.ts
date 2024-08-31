import fs from "fs";
import {ContentNode} from "../../../types/pathHarvester.types";

export interface IFileHandler {
  readFile(filePath: string): Promise<string>;
  readDir(directoryPath: string): Promise<string[]>;
  stat(itemPath: string): Promise<fs.Stats>;
}

export interface IUserInterface {
  confirm(question: string): Promise<boolean>;
}

export interface IIgnoreList {
  shouldIgnore(itemPath: string): boolean;
}
export interface FileOrFolder {
  relativePath: string; // The relative path of the file or folder
  isFile: boolean;      // Indicates whether this is a file
  content?: string | null; // Optional content of the file, null if it's a folder or content isn't included
}

export interface BuildContentResult {
  folderStructure: string;
  ignoredFiles: string;
  contentTree?: ContentNode;
}

export interface StartCopyingProcessResult extends BuildContentResult {
  message: string;
}
//
// interface IOpenAiService {
//   generateTestFileStructure(input: string): Promise<StructuredOutput>;
//   generateTerminalCommands(input: string): Promise<StructuredCommandOutput>;
// }


// Enum representing the different copy options
export enum CopyOptions {
  CopycontentTree = '1',
  OnlyCopyStructure = '2',
}
