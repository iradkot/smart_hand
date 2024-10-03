import {BuildContentResult} from "../../types/interfaces";
import {ContentTree} from "../../../../types/pathHarvester.types";

export class CopyOptionHandler {
  /**
   * Constructs a textual representation of the folder structure,
   * ignored files, and optionally, the content of the files.
   */
  static buildContent(
    folderStructure: string[],
    ignoredFiles: string[],
    resultDict: ContentTree,
  ): BuildContentResult {
    const result: Record<string, any> = {
      folderStructure: folderStructure.join(''),
      ignoredFiles: ignoredFiles.join(''),
      contentTree: Object.values(resultDict)[0]
    };
    return result as BuildContentResult;
  }
}
