// src/main/utils/packageUtils.ts

import fs from 'fs';
import path from 'path';

/**
 * Recursively searches for package.json starting from the given directory and moving up the directory tree.
 * @param packageJsonPath The path to the package.json file.
 * @returns The TypeScript version string or null if not found.
 */
export function getTypeScriptVersion(packageJsonPath: string): string | null {
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const tsVersion = packageJson.devDependencies?.typescript || packageJson.dependencies?.typescript;

    if (tsVersion) {
      return tsVersion;
    } else {
      console.warn('TypeScript is not listed as a dependency in package.json.');
      return null;
    }
  }


  console.warn('package.json not found in any parent directories.');
  return null;
}

/**
 * Detects the package manager used in the project by checking for lock files.
 * @param projectPath The project directory path.
 * @returns 'yarn' or 'npm' based on detected lock files.
 */
export function detectPackageManager(projectPath: string): 'yarn' | 'npm' {
  const yarnLockPath = path.join(projectPath, 'yarn.lock');
  const npmLockPath = path.join(projectPath, 'package-lock.json');

  if (fs.existsSync(yarnLockPath)) {
    return 'yarn';
  } else if (fs.existsSync(npmLockPath)) {
    return 'npm';
  } else {
    // Default to npm if no lockfile is found
    return 'npm';
  }
}
