import { CommandExecutor } from '../utils/CommandExecutor';
import {generateTestFile} from "../../api/requests/aiOperationsRequests";
import {FileHandler} from "../fileOperations/utils/FileHandler"; // Assume you have or create this

export async function createAndRunTest(
  sessionId: string,
  directoryPath: string,
  fileContent: string,
  instructions?: string
): Promise<void> {
  console.log('Creating and running test...');
  // Step 1: Generate the test file content
  const testResponse = await generateTestFile(sessionId, fileContent, instructions);
  const { content, filename } = testResponse;

  console.log('Generated test file:', filename);
  // Step 2: Create the test file in the specified directory
  const fileHandler = new FileHandler();
  console.log('Creating test file at:', directoryPath);
  await fileHandler.writeFile(`${directoryPath}/${filename}`, content);

  console.log('Test file created:', filename);
  // Step 3: Execute any commands if necessary
  // const commandExecutor = new CommandExecutor();
  // const commandResponse = await commandExecutor.executeCommand(`run ${directoryPath}/${filename}`);
  // console.log(commandResponse);
}
