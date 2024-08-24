import path from 'path';
import {BuildContentResult} from "../types/interfaces";

// Enum representing the different copy options
export enum CopyOptions {
  CopyFileContents = '1',
  OnlyCopyStructure = '2',
}

// Type definition for files and folders array elements
interface FileOrFolder {
  relativePath: string;
  isFile: boolean;
  content?: string | null;
}

export class CopyOptionHandler {
  /**
   * Constructs a textual representation of the folder structure,
   * ignored files, and optionally, the content of the files.
   */
  static buildContent(
    folderStructure: string[],
    ignoredFiles: string[],
    fileEntries: string[],
    option: CopyOptions
  ): BuildContentResult  {
    const result: Record<string, any> = {
      folderStructure: folderStructure.join(''),
      ignoredFiles: ignoredFiles.join(''),
    };

    console.log({fileEntries})

    if (option === CopyOptions.CopyFileContents && fileEntries.length > 0) {
      result['fileContents'] = fileEntries;
    }

    return result;
  }

  /**
   * Creates a hierarchical object representing the folder and file structure.
   */
  static buildStructuredOutput(
    filesAndFolders: FileOrFolder[]
  ): Record<string, any> {
    const structure: Record<string, any> = {};

    filesAndFolders.forEach((item) => {
      const parts = item.relativePath.split(path.sep);
      let current = structure;

      parts.forEach((part, index) => {
        if (!current[part]) {
          if (index === parts.length - 1 && item.isFile) {
            current[part] = item.content || ''; // File content or empty string
          } else {
            current[part] = {};
          }
        }
        current = current[part];
      });
    });

    return structure;
  }
}
