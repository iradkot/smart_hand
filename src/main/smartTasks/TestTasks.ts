import { CommandExecutor } from '../utils/CommandExecutor';
import {generateTestFile, getTestLibraries} from "../../api/requests/aiOperationsRequests";
import {FileHandler} from "../fileOperations/utils/FileHandler";
import {findTypeDefinitionsForDependencySync} from "./FindTypeDefinitionsForDependency";
import {createTestFilePrompt} from "../../prompts/createTestFile.prompt";
import gatherTypesAndInterfaces from "./gatherTypesAndInterfaces";
import fs from "fs";
import cleanContent from "../utils/minimizeAndCleanStrings"; // Assume you have or create this

export async function createAndRunTest(
  sessionId: string,
  directoryPath: string,
  fileContent: string,
  fileName: string,
  instructions?: string,
  packageJsonContent?: string
): Promise<void> {
  let finalInstructions = instructions;
  console.log('Sending request to generate test file');
  // step 0: Get test libraries from package.json
  const testLibraries = await getTestLibraries(sessionId, packageJsonContent);
  console.log({ testLibraries });
  // step 0.5: get types from test libraries
  const testLibrariesTypes = await findTypeDefinitionsForDependencySync(testLibraries?.content?.libraries);
  const testLibrariesTypesString = JSON.stringify(testLibrariesTypes);
  console.log('Creating instructions for test file');
  // get the grand grand parent directory using the fs module
  const directoryPathGrandGrandParent = fs.realpathSync(directoryPath + '/../../..');
  console.log({directoryPathGrandGrandParent, directoryPath})
  const additionalTypes = await gatherTypesAndInterfaces(directoryPathGrandGrandParent, 10, 10000);

  const cleanedAdditionalTypes = cleanContent(additionalTypes);

  const instruction = createTestFilePrompt({targetFile: fileContent,  targetDirectory: directoryPath, testLibrariesTypes: testLibrariesTypesString, additionalTypes: cleanedAdditionalTypes});
  // Step 1: Generate the test file content
  const testResponse = await generateTestFile(sessionId, fileContent, instruction);

  const { content } = testResponse;

  console.log('Generated test file:', content.testFileName);
  // Step 2: Create the test file in the specified directory
  const fileHandler = new FileHandler();
  let testFileName = fileName.includes('.')
    ? fileName.replace(/(\.[^.]+)$/, '.test$1')
    : `${fileName}.test`;

  console.log('Creating test file at:', directoryPath);
  await fileHandler.writeFile(`${directoryPath}/${testFileName}`, content.testCode);

  console.log('Test file created:', content.testFileName);
  // // Step 3: Execute any commands if necessary
  // // const commandExecutor = new CommandExecutor();
  console.log('Executing command:', content.runCommand);
  // const commandResponse = await commandExecutor.executeCommand(content.runCommand);
  // console.log(commandResponse);
}
