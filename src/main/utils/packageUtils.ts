// src/main/utils/packageUtils.ts

import fs from 'fs';
import path from 'path';

export function getTypeScriptVersion(packageJsonPath: string): string | null {
  if (!fs.existsSync(packageJsonPath)) {
    console.warn('package.json not found in the specified directory.');
    return null;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const tsVersion = packageJson.devDependencies?.typescript || packageJson.dependencies?.typescript;

  if (!tsVersion) {
    console.warn('TypeScript is not listed as a dependency in package.json.');
    return null;
  }

  return tsVersion;
}

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
