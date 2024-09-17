// src/main/smartTasks/TestTasks.ts

import { setupTestsForProject } from "../utils/setupTestsForProject";
import { commonTestLibraries, platformTestLibraries, TestLibrary, tsCompatibility } from "../utils/setupTestsForProject/testLibraries";
import { analyzePackageJson, AnalyzePackageJsonContent, generateTestFile } from "../../api/requests/aiOperationsRequests";
import semver from 'semver';
import { promptUserConfirmation } from "../fileOperations/utils/UserInterface";
import { FileHandler } from "../fileOperations/utils/FileHandler";
import { detectPackageManager, getTypeScriptVersion } from "../utils/packageUtils";

export async function createAndRunTest(
  sessionId: string,
  directoryPath: string,
  fileContent: string,
  fileName: string,
  packageJsonPath: string,
  instructions?: string,
  packageJsonContent?: string
): Promise<void> {

  console.log({sessionId,
    directoryPath,
    fileContent,
    fileName,
    packageJsonPath,
    instructions,
    packageJsonContent})

  try {
    // Step 0: Analyze package.json
    const analyzedPackageJsonResponse = await analyzePackageJson(sessionId, packageJsonContent);
    const analyzedPackageJson = analyzedPackageJsonResponse.content as AnalyzePackageJsonContent;

    // Step 0.1: Determine project type
    const projectType = mapProjectType(analyzedPackageJson.projectType);
    if (projectType === 'unknown') {
      console.warn('Project type is unknown. Skipping test setup verification.');
      return;
    }

    // Step 0.2: Setup Testing Environment
    const tsVersionRaw = getTypeScriptVersion(packageJsonPath);


    if (!tsVersionRaw) {
      console.warn('Cannot determine TypeScript version. Skipping test setup.');
    } else {
      const tsVersion = semver.coerce(tsVersionRaw)?.version;
      if (!tsVersion) {
        console.warn('Invalid TypeScript version format. Skipping test setup.');
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
              await setupTestsForProject(packageJsonPath, projectType);
            } else {
              console.log('User declined to set up the testing environment.');
              return; // Halt the process
            }
          } else {
            console.log('All test libraries are correctly installed. Proceeding to create the test file...');
          }
        } else {
          console.warn(`No compatible testing libraries found for TypeScript version ${tsVersion}. Skipping test setup.`);
        }
      }
    }

    // **HALT THE PROCESS IF TEST SETUP WAS SKIPPED**
    console.log('2222')
    const tsVersionFinal = getTypeScriptVersion(directoryPath);
    if (!tsVersionFinal) {
      console.warn('Test setup was skipped due to missing TypeScript version. Halting test generation.');
      return;
    }

    console.log({instructions})

    // Step 1: Generate the test file content
    // const testResponse = await generateTestFile(sessionId, fileContent, instructions);
    //
    // const { content } = testResponse;
    //
    // console.log('Generated test file:', content.testFileName);
    //
    // // **Ensure the Test Environment is Properly Set Up Before Proceeding**
    //
    // // Step 2: Create the test file in the specified directory
    // const fileHandler = new FileHandler();
    // const testFileName = fileName.includes('.')
    //   ? fileName.replace(/(\.[^.]+)$/, '.test$1')
    //   : `${fileName}.test`;
    //
    // console.log('Creating test file at:', directoryPath);
    // await fileHandler.writeFile(`${directoryPath}/${testFileName}`, content.testCode);
    //
    // console.log('Test file created:', content.testFileName);
    //
    // // Step 3: Execute any commands if necessary
    // console.log('Executing command:', content.runCommand);
    // Uncomment the following lines if command execution is required
    // const commandExecutor = new CommandExecutor();
    // const commandResponse = await commandExecutor.executeCommand(content.runCommand);
    // console.log(commandResponse);

  } catch (error) {
    console.error('Error in createAndRunTest:', error);
    throw error;
  }
}

// Helper function to map projectType from API response to setupTestsForProject expected value
function mapProjectType(apiProjectType: 'react-web' | 'react-native' | 'electron' | 'unknown'): 'web' | 'react-native' | 'electron' | 'unknown' {
  switch (apiProjectType) {
    case 'react-web':
      return 'web';
    case 'react-native':
      return 'react-native';
    case 'electron':
      return 'electron';
    default:
      return 'unknown';
  }
}
