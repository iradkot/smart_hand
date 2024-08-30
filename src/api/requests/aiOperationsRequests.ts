import { smartHandServer } from '../axiosInstances'
import {handleError} from "../../utils/ErrorHandler";

interface TestDescription {
  title: string;
  description: string;
  instructions: string;
}

interface GenerateTestFileResponse {
  testDescription: TestDescription;
  testFileName: string;
  testCode: string;
  runCommand: string;
}

interface APIResponse<T> {
  content: T;
}


export const askGPTPost = async (sessionId: string, input: string): Promise<APIResponse<any>> => {
  try {
    const response = await smartHandServer.post('/chat', {
      sessionId,
      messages: [input],
    });
    return response.data;
  } catch (error) {
    console.log('Error in askGPTPost:', error);
    throw error;
  }
};

export const generateTestFile = async (
  sessionId: string,
  fileContent: string,
  instructions?: string
): Promise<APIResponse<GenerateTestFileResponse>> => {
  try {
    const response = await smartHandServer.post('/generateTestFile', {
      sessionId,
      fileContent,
      instructions,
    });
    console.log('Response from generateTestFile:', response.data);
    return response.data;
  } catch (error) {
    handleError(error, 'Error in askGPTPost');
    throw error;
  }
};


export const generateTerminalCommands = async (sessionId: string, input: string): Promise<APIResponse<any>> => {
  try {
    const response = await smartHandServer.post('/generateTerminalCommands', {
      sessionId,
      input,
    });
    return response.data;
  } catch (error) {
    console.log('Error in generateTerminalCommands:', error);
    throw error;
  }
};

