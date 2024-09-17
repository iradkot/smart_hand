// src/main/utils/setupTestsForProject/index.ts

import { createJestConfig, createJestSetup } from './jestConfig';
import { runCommand } from '../commandRunner';
import { updatePackageJson } from './packageJson';
import { commonTestLibraries, platformTestLibraries, TestLibrary, tsCompatibility } from './testLibraries';
import {detectPackageManager, getTypeScriptVersion} from '../packageUtils';

export const setupTestsForProject = async (packageJsonPath: string, platform: string): Promise<void> => {
  console.log(`Setting up tests for ${platform} project at ${packageJsonPath}...`);

  try {
    // Detect the package manager
    const packageManager = detectPackageManager(packageJsonPath);
    console.log(`Detected package manager: ${packageManager}`);

    // Get TypeScript version
    const tsVersionRaw = getTypeScriptVersion(packageJsonPath);
    if (!tsVersionRaw) {
      console.warn('Cannot determine TypeScript version. Skipping test setup.');
      return;
    }

    // Parse TypeScript version using semver
    const semver = require('semver');
    const tsVersion = semver.coerce(tsVersionRaw)?.version;
    if (!tsVersion) {
      console.warn('Invalid TypeScript version format. Skipping test setup.');
      return;
    }

    // Select compatible testing libraries based on TypeScript version
    let compatibleTestLibraries: TestLibrary[] = [];

    for (const [range, libs] of Object.entries(tsCompatibility)) {
      if (semver.satisfies(tsVersion, range)) {
        compatibleTestLibraries = libs;
        break;
      }
    }

    if (compatibleTestLibraries.length === 0) {
      console.warn(`No compatible testing libraries found for TypeScript version ${tsVersion}. Skipping test setup.`);
      return;
    }

    // Combine commonTestLibraries and compatibleTestLibraries
    const allTestLibraries = [
      ...commonTestLibraries.filter(lib => !compatibleTestLibraries.some(cLib => cLib.name === lib.name)),
      ...compatibleTestLibraries,
    ];

    // Prepare the install command based on the package manager
    const commonDeps = allTestLibraries.map(lib => `${lib.name}@${lib.version}`).join(' ');
    const platformDeps = platformTestLibraries[platform]?.map(lib => `${lib.name}@${lib.version}`).join(' ') || '';

    let installCommand = '';

    if (packageManager === 'yarn') {
      installCommand = `yarn add --dev ${commonDeps} ${platformDeps}`.trim();
    } else {
      // npm
      installCommand = `npm install --save-dev ${commonDeps} ${platformDeps}`.trim();
    }

    console.log(`Installing dependencies with ${packageManager}: ${installCommand}`);

    await runCommand(installCommand, packageJsonPath);

    // Create/update jest.config.js and jest-setup.ts
    await updatePackageJson(packageJsonPath);
    await createJestConfig(packageJsonPath, platform);
    await createJestSetup(packageJsonPath);

    console.log('Testing setup complete.');
  } catch (error) {
    console.error('Error setting up testing environment:', error);
  }
};
