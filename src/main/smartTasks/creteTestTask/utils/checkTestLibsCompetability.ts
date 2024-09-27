import semver from "semver";
import {commonTestLibraries, TestLibrary, tsCompatibility} from "../../../utils/setupTestsForProject/testLibraries";
import {promptUserConfirmation} from "../../../fileOperations/utils/UserInterface";
import {setupTestsForProject} from "../../../utils/setupTestsForProject";

interface CheckTestLibsCompetabilityOptions {
  tsVersionRaw: string;
  analyzedPackageJson: any;
  projectPath: string;
  projectType: string;
}

export const checkTestLibsCompetability = async ({ tsVersionRaw, analyzedPackageJson, projectPath, projectType }: CheckTestLibsCompetabilityOptions) => {
  if (!tsVersionRaw) {
    console.warn('Cannot determine TypeScript version. Skipping test setup.');
    return false;
  } else {
    const tsVersion = semver.coerce(tsVersionRaw)?.version;
    if (!tsVersion) {
      console.warn('Invalid TypeScript version format. Skipping test setup.');
      return false;
    } else {
      console.log(`Detected TypeScript version: ${tsVersion}`);

      // Select compatible testing libraries
      let compatibleTestLibraries: TestLibrary[] = [];

      for (const [range, libs] of Object.entries(tsCompatibility)) {
        if (semver.satisfies(tsVersion, range)) {
          compatibleTestLibraries = libs;
          break;
        }
      }

      if (compatibleTestLibraries.length > 0) {
        const allTestLibraries = [
          ...commonTestLibraries.filter(lib => !compatibleTestLibraries.some(cLib => cLib.name === lib.name)),
          ...compatibleTestLibraries,
        ];

        const mismatchedLibraries = allTestLibraries.filter(lib => {
          const installedLib = analyzedPackageJson.testLibraries?.find(l => l.name === lib.name);
          if (!installedLib) return true;
          return !semver.satisfies(semver.coerce(installedLib.version)?.version || '0.0.0', lib.version);
        });

        if (mismatchedLibraries.length > 0) {
          // Prepare the prompt message
          const promptMessage = `In order to work with Smart Hand on your project, we need to work with these specific test libraries and versions:\n\n` +
            mismatchedLibraries.map(lib => {
              const installedLib = analyzedPackageJson.testLibraries?.find(l => l.name === lib.name);
              let status = '❌';
              let detail = '';

              if (installedLib) {
                status = '❌';
                detail = ` (Installed version: ${installedLib.version})`;
              } else {
                status = '❌';
                detail = ' (Not installed)';
              }

              return `${lib.name}, version: ${lib.version} You have it -> ${status}${detail}`;
            }).join('\n') +
            `\n\nDo you want to proceed with setting up the testing environment?`;

          // Prompt the user for confirmation
          const userConfirmed = await promptUserConfirmation(promptMessage);

          if (userConfirmed) {
            // Run setupTestsForProject
            console.log('Setting up the testing environment...');
            await setupTestsForProject({projectPath, platform: projectType});
            return true; // TODO, we should return the result of the setupTestsForProject function and it returns a boolean
          } else {
            console.log('User declined to set up the testing environment.');
            return false;
          }
        } else {
          console.log('All test libraries are correctly installed. Proceeding to create the test file...');
          return true;
        }
      } else {
        console.warn(`No compatible testing libraries found for TypeScript version ${tsVersion}. Skipping test setup.`);
        return false;
      }
    }
  }
}
