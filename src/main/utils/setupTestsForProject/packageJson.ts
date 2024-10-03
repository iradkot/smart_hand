// src/main/utils/setupTestsForProject/packageJson.ts

import fs from 'fs';

export const updatePackageJson = async (packageJsonPath: string): Promise<void> => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.scripts = {
    ...packageJson.scripts,
    test: "jest",
    "test:watch": "jest --watch",
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with Jest scripts.');
};
