// src/main/fileOperations/utils/IgnoreAndAllowList.ts
import path from "node:path";
import fs from "fs";
import { IIgnoreList } from "../types/interfaces";
import { ALLOWED_WHITELIST_EXTENSIONS, IGNORE_LIST } from 'src/constants/ignoreList'

/**
 * Combine two approaches:
 * 1) Skip certain directories/files entirely by name (the "ignoreList").
 * 2) For files not explicitly ignored by name, only allow certain file extensions.
 */
export class IgnoreAndAllowList implements IIgnoreList {
  /**
   * Example: list of directories/files to ignore by exact name
   * (e.g., node_modules, build, .git, etc.).
   */
  private readonly ignoredByName = new Set(IGNORE_LIST);

  /**
   * Example: allowed file extensions (lowercase).
   */
  private static readonly ALLOWED_EXTENSIONS = new Set(ALLOWED_WHITELIST_EXTENSIONS);

  shouldIgnore(itemPath: string): boolean {
    const baseName = path.basename(itemPath);

    // 1) If baseName is explicitly in the ignoredByName set, ignore it
    if (this.ignoredByName.has(baseName)) {
      return true;
    }

    // 2) Check if itemPath is a directory
    try {
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        // If it's a directory and wasn't in the ignore set above, allow it.
        // We still want to recurse into directories to possibly find whitelisted files inside.
        return false;
      }
    } catch {
      // If we fail to stat the file, safer to ignore it
      return true;
    }

    // 3) For files, check extension against ALLOWED_EXTENSIONS
    const ext = path.extname(itemPath).toLowerCase();
    // If the extension is NOT in our allowed list => ignore it
    return !IgnoreAndAllowList.ALLOWED_EXTENSIONS.has(ext);
  }
}
