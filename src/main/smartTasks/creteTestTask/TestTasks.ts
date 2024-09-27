// src/main/smartTasks/TestTasks.ts

import {setupTestsForProject} from "../../utils/setupTestsForProject";
import {
  commonTestLibraries,
  platformTestLibraries,
  TestLibrary,
  tsCompatibility
} from "../../utils/setupTestsForProject/testLibraries";
import {
  analyzePackageJson,
  AnalyzePackageJsonContent,
  generateTestFile
} from "../../../api/requests/aiOperationsRequests";
import semver from 'semver';
import {promptUserConfirmation} from "../../fileOperations/utils/UserInterface";
import {FileHandler} from "../../fileOperations/utils/FileHandler";
import {detectPackageManager, getTypeScriptVersion} from "../../utils/packageUtils";
import {createTestFilePrompt, handleTestRunErrorPrompt} from "../../../prompts/createTestFile.prompts";
import {getTestExamples} from "./utils/getTestExamples";
import {checkTestLibsCompetability} from "./utils/checkTestLibsCompetability";
import {runCommand} from "../../utils/commandRunner";

export async function createAndRunTest(
  sessionId: string,
  directoryPath: string,
  fileContent: string,
  fileName: string,
  packageJsonPath: string,
  instructions?: string,
  packageJsonContent?: string
): Promise<void> {

  try {
    const projectPath = packageJsonPath.replace('package.json', '');
    // Step 0: Analyze package.json
    const analyzedPackageJsonResponse = await analyzePackageJson(sessionId, packageJsonContent);
    const analyzedPackageJson = analyzedPackageJsonResponse.content as AnalyzePackageJsonContent;

    const projectType = mapProjectType(analyzedPackageJson.projectType);
    if (projectType === 'unknown') {
      console.warn('Project type is unknown. Skipping test setup verification.');
      return;
    }

    // Step 0.2: Setup Testing Environment
    const tsVersionRaw = getTypeScriptVersion(packageJsonPath);
    const packageManager = detectPackageManager(projectPath);


    // const testLibsCompatibility = await checkTestLibsCompetability({
    //   tsVersionRaw,
    //   analyzedPackageJson,
    //   projectPath,
    //   projectType
    // });
    // // **HALT THE PROCESS IF TEST SETUP WAS SKIPPED**
    // if (!testLibsCompatibility) {
    //   console.warn('Test setup was skipped. Halting test generation.');
    //   return;
    // }
    if (!tsVersionRaw) {
      console.warn('Test setup was skipped due to missing TypeScript version. Halting test generation.');
      return;
    }

    const testExamples = await getTestExamples();

    // start testing loop
    let testCode: string = '';
    let testFileName: string = fileName.includes('.')
      ? fileName.replace(/(\.[^.]+)$/, '.test$1')
      : `${fileName}.test`;
    let testFilePath = `${directoryPath}/${testFileName}`;
    let lastErrorMessage: string = '';
    const maxRetries = 3;

    const fileHandler = new FileHandler();


    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`Attempt ${attempt} of ${maxRetries}`);

      let prompt: string;

      if (attempt === 1) {
        // First attempt: Generate initial test code
        prompt = createTestFilePrompt({
          targetDirectory: directoryPath,
          targetFile: fileName,
          fileContent: fileContent,
          analyzedTestLibraries: JSON.stringify(analyzedPackageJson.testLibraries, null, 2),
          testExamples
        });
      } else {
        // Subsequent attempts: Use error messages to correct the test code
        prompt = handleTestRunErrorPrompt({
          errorMessage: lastErrorMessage,
          generatedTestFile: testFileName,
          testCode: testCode
        });
      }

      testFilePath =`${directoryPath}/${attempt}_${testFileName}`;


      // Generate or correct test code
      console.log(`createTestFilePrompt (attempt ${attempt}):`, prompt);
      const testResponse = await generateTestFile(sessionId, fileContent, prompt);
      const {content} = testResponse;

      testCode = content.testCode;

      console.log(`Generated test code(try ${attempt}):`, testCode);

      // Write test file
      await fileHandler.writeFile(testFilePath, testCode);
      // write prompt to file
      await fileHandler.writeFile(`${directoryPath}/${attempt}_prompt.txt`, prompt);

      // Run tests
      const runTestCommand = `${packageManager} test --runTestsByPath  --no-color ${testFilePath}`;

      try {
        const {stdout, stderr} = await runCommand(runTestCommand, projectPath);
        console.log('Test command output:', stdout);

        if (stderr) {
          console.error('Test command error output:', stderr);
          // Capture error message and continue to next iteration
          lastErrorMessage = stderr;
          continue;
        }

        // Tests passed
        console.log('Tests passed successfully');
        return; // Exit the function
      } catch (error) {
        console.error('Error in test execution:', error);
        // Capture error message and continue to next iteration
        lastErrorMessage = error?.stderr || error?.message || 'Unknown error';
      }
    }

// If tests did not pass after maximum retries
    throw new Error('Failed to generate passing tests after maximum retries');
  } catch (error) {
    console.error('Error in createAndRunTest:', error);
    throw error;
  }
}

// Helper function to map projectType from API response to setupTestsForProject expected value
function mapProjectType(apiProjectType: 'react-web' | 'react-native' | 'electron' | 'node-server' | 'unknown'): 'web' | 'react-native' | 'electron' | 'node-server' | 'unknown' {
  switch (apiProjectType) {
    case 'react-web':
      return 'web';
    case 'node-server':
      return 'node-server';
    case 'react-native':
      return 'react-native';
    case 'electron':
      return 'electron';
    default:
      return 'unknown';
  }
}
