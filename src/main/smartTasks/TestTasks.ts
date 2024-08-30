import { CommandExecutor } from '../utils/CommandExecutor';
import {generateTestFile} from "../../api/requests/aiOperationsRequests";
import {FileHandler} from "../fileOperations/utils/FileHandler"; // Assume you have or create this

export async function createAndRunTest(
  sessionId: string,
  directoryPath: string,
  fileContent: string,
  instructions?: string
): Promise<void> {
  console.log('Sending request to generate test file');
  // Step 1: Generate the test file content
  const testResponse = await generateTestFile(sessionId, fileContent, instructions);

  const { content } = testResponse;

  console.log('Generated test file:', content.testFileName);
  // Step 2: Create the test file in the specified directory
  const fileHandler = new FileHandler();
  console.log('Creating test file at:', directoryPath);
  await fileHandler.writeFile(`${directoryPath}/${content.testFileName}`, content.testCode);

  console.log('Test file created:', content.testFileName);
  // Step 3: Execute any commands if necessary
  // const commandExecutor = new CommandExecutor();
  console.log('Executing command:', content.runCommand);
  // const commandResponse = await commandExecutor.executeCommand(content.runCommand);
  // console.log(commandResponse);
}
