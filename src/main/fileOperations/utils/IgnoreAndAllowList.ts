import path from "node:path";
import fs from "fs";
import { IIgnoreList } from "../types/interfaces";
import { ALLOWED_FILE_NAMES, ALLOWED_WHITELIST_EXTENSIONS, IGNORE_LIST } from 'src/constants/ignoreList'

export class IgnoreAndAllowList implements IIgnoreList {
  /**
   * Directories or filenames to always ignore entirely,
   * no matter their extension. For example: node_modules, .git.
   */
  private readonly ignoredByName = new Set(IGNORE_LIST);

  /**
   * Whitelisted file extensions (lowercase).
   * Add or remove from this set as your project requires.
   */
  private static readonly ALLOWED_EXTENSIONS = new Set(ALLOWED_WHITELIST_EXTENSIONS);

  /**
   * Whitelisted filenames that may have no extension
   * (e.g., dotfiles or special config files).
   */
  private static readonly ALLOWED_FILENAMES = new Set(ALLOWED_FILE_NAMES);

  shouldIgnore(itemPath: string): boolean {
    const baseName = path.basename(itemPath);

    // 1) If baseName is in the ignoredByName set, skip it immediately
    if (this.ignoredByName.has(baseName)) {
      return true;
    }

    // 2) Try to stat the path
    let stats: fs.Stats;
    try {
      stats = fs.statSync(itemPath);
    } catch {
      // If we fail to stat the file, ignore it to be safe
      return true;
    }

    // 3) If it’s a directory (and not explicitly ignored), allow recursion into it
    if (stats.isDirectory()) {
      return false;
    }

    // 4) If it’s a file, check extension
    const ext = path.extname(baseName).toLowerCase();
    if (IgnoreAndAllowList.ALLOWED_EXTENSIONS.has(ext)) {
      // extension is allowed => do not ignore
      return false;
    }

    // 5) Check if the entire filename (for dotfiles or special files) is allowed
    if (IgnoreAndAllowList.ALLOWED_FILENAMES.has(baseName)) {
      return false;
    }

    // 6) Otherwise, ignore
    return true;
  }
}
