import { createIndentationString } from "./CreateIndentationString";
import path from "path";
import { CopyOptions, FileOrFolder, IFileHandler } from "../../types/interfaces";
import { normalizePath } from '../../../utils/PathUtils'

export async function processFile(
  itemPath: string,
  relativeItemPath: string,
  option: CopyOptions,
  depth: number,
  isLast: boolean,
  fileHandler: IFileHandler
): Promise<{ structure: string[], ignored: string[], filesAndFolders: FileOrFolder[], resultDict: Record<string, any> }> {
  // Normalize the item path
  const normalizedItemPath = normalizePath(itemPath);

  const prefix = createIndentationString(depth, isLast);
  const fileName = path.basename(normalizedItemPath);

  const folderStructure = [`${prefix}${fileName}\n`];
  const fileContent = option === CopyOptions.CopycontentTree ? await fileHandler.readFile(normalizedItemPath) : null;
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
      localPath: normalizedItemPath, // Assign the full local path here
    }
  };

  return { structure: folderStructure, ignored: fileEntries, filesAndFolders, resultDict };
}
