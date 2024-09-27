// src/main/utils/setupTestsForProject/index.ts

import { createJestConfig, createJestSetup } from './jestConfig';
import { runCommand } from '../commandRunner';
import { updatePackageJson } from './packageJson';
import { commonTestLibraries, platformTestLibraries, TestLibrary, tsCompatibility } from './testLibraries';
import { detectPackageManager, getTypeScriptVersion } from '../packageUtils';
import {handleError} from "../../../utils/ErrorHandler";

interface SetupTestsForProjectOptions {
  projectPath: string;
  platform: string;
}
export const setupTestsForProject = async ({projectPath,, platform}: SetupTestsForProjectOptions): Promise<void> => {
  console.log(`Setting up tests for ${platform} project at ${projectPath}...`);

  try {
    // Detect the package manager
    const packageManager = detectPackageManager(projectPath);
    console.log(`Detected package manager: ${packageManager}`);

    // Get TypeScript version
    const tsVersionRaw = getTypeScriptVersion(projectPath);
    if (!tsVersionRaw) {
      throw new Error('Cannot determine TypeScript version. Ensure package.json exists and TypeScript is listed as a dependency.');
    }

    // Parse TypeScript version using semver
    const semver = require('semver');
    const tsVersion = semver.coerce(tsVersionRaw)?.version;
    if (!tsVersion) {
      throw new Error('Invalid TypeScript version format. Please check your package.json.');
    }

    console.log(`Detected TypeScript version: ${tsVersion}`);

    // Select compatible testing libraries based on TypeScript version
    let compatibleTestLibraries: TestLibrary[] = [];

    for (const [range, libs] of Object.entries(tsCompatibility)) {
      if (semver.satisfies(tsVersion, range)) {
        compatibleTestLibraries = libs;
        break;
      }
    }

    if (compatibleTestLibraries.length === 0) {
      throw new Error(`No compatible testing libraries found for TypeScript version ${tsVersion}.`);
    }

    console.log('Compatible testing libraries:', compatibleTestLibraries);

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

    await runCommand(installCommand, projectPath);

    // Create/update jest.config.js and jest-setup.ts
    await updatePackageJson(projectPath);
    await createJestConfig(projectPath, platform);
    await createJestSetup(projectPath);

    console.log('Testing setup complete.');
  } catch (error) {
    console.error('Error setting up testing environment:', handleError(error, 'setupTestsForProject'));
    throw error; // Re-throw to be caught by the caller
  }
};
