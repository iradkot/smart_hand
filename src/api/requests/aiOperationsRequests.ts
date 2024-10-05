import { smartHandServer } from '../axiosInstances';
import { handleError } from "../../utils/ErrorHandler";

interface TestDescription {
  title: string;
  description: string;
  instructions: string;
}

interface GenerateTestFileResponse {
  testDescription: TestDescription;
  testFileName: string;
  testCode: string;
  requestedFiles: string[];
  runCommand: string;

}

interface APIResponse<T> {
  content: T;
}

export interface Library {
  name: string;
  version: string;
}

export interface AnalyzedPackageJsonData {
  testLibraries: Library[];
  styleLibraries: Library[];
  utilityLibraries: Library[];
  otherLibraries: Library[];
  projectType: 'react-web' | 'react-native' | 'electron' | 'node-server' | 'unknown';
}

export interface AnalyzePackageJsonResponse extends APIResponse<AnalyzedPackageJsonData> {}

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
  instructions: string
): Promise<APIResponse<GenerateTestFileResponse>> => {
  try {
    const response = await smartHandServer.post('/generateTestFile', {
      sessionId,
      fileContent,
      instructions,
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Error in generateTestFile');
    throw error;
  }
};


export const analyzePackageJson = async (sessionId: string, packageJson?: string): Promise<AnalyzePackageJsonResponse> => {
  try {
    if (!packageJson) {
      throw new Error('Package.json not found');
    }
    const response = await smartHandServer.post('/analyzePackageJson', {
      sessionId,
      packageJson, // Send package.json from the client
    });
    return response.data;
  } catch (error) {
    console.log('Error in analyzePackageJson:', error);
    throw error;
  }
};
