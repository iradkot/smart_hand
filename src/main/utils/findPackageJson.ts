import { existsSync } from 'fs';
import { join, dirname } from 'path';

// Helper function to search for package.json up to 5 parent directories
function findPackageJson(directoryPath: string, maxDepth: number = 7): string | null {
  let currentPath = directoryPath;
  for (let i = 0; i < maxDepth; i++) {
    const packageJsonPath = join(currentPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      return packageJsonPath;
    }
    const parentPath = dirname(currentPath);
    if (parentPath === currentPath) {
      break; // We've reached the root directory
    }
    currentPath = parentPath;
  }
  console.log('No package.json found within', maxDepth, 'parent directories');
  return null; // No package.json found within maxDepth
}

export default findPackageJson;
