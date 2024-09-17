// src/main/utils/setupTestsForProject/packageJson.ts

import fs from 'fs';
import path from 'path';

export const updatePackageJson = async (directoryPath: string): Promise<void> => {
  const packageJsonPath = path.join(directoryPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.scripts = {
    ...packageJson.scripts,
    test: "jest",
    "test:watch": "jest --watch",
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with Jest scripts.');
};
