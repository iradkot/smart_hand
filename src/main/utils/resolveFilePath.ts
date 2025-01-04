// src/main/utils/resolveFilePath.ts

import fs from 'fs';
import path from 'path';

/**
 * Attempt to resolve a file path by checking possible extensions,
 * if the file doesn't already specify one (like 'FooBar.js').
 *
 * Example usage:
 *   resolveFilePath('/Users/irad/project/src/Example', [".ts",".js",".tsx",".jsx"])
 * might return "/Users/irad/project/src/Example.ts" if that exists.
 *
 * @param rawPath The path to check, which may or may not have an extension
 * @param extensions The list of extensions to try
 * @returns A valid absolute path if found, otherwise null
 */
export function resolveFilePath(rawPath: string, extensions: string[]): string | null {
  // 1) If rawPath already has an extension, just check that file
  const extname = path.extname(rawPath);
  if (extname) {
    // If file with this extension exists, return it. Otherwise null.
    return fs.existsSync(rawPath) ? rawPath : null;
  }

  // 2) If no extension, try each extension in turn
  for (const ext of extensions) {
    const candidate = rawPath + ext;
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null; // Not found
}
