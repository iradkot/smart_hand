import { smartHandServer } from '../axiosInstances'
import { handleError } from '../../utils/ErrorHandler'

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
    const errorMsg = handleError(error, 'askGPTPost');
    throw new Error(errorMsg);
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
    const errorMsg = handleError(error, 'generateTestFile');
    throw new Error(errorMsg);
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
    const errorMsg = handleError(error, 'analyzePackageJson');
    throw new Error(errorMsg);
  }
};

interface ClassificationResponse {
  fileType?: string;
  mocksNeeded?: string[];
}

export async function classifyFile(
  sessionId: string,
  fileContent: string,
  instructions?: string
): Promise<ClassificationResponse> {
  try {
    const response = await smartHandServer.post('/classifyFile', {
      sessionId,
      fileContent,
      instructions,
    });
    return response.data.content;
    // => { fileType: "something", mocksNeeded: [ "...", ... ] }
  } catch (error) {
    const msg = handleError(error, 'classifyFile');
    throw new Error(msg);
  }
}

export const getTestSummary = async (
  sessionId: string, 
  context: any
): Promise<APIResponse<string>> => {
  try {
    const response = await smartHandServer.post('/testSummary', {
      sessionId,
      context,
    });
    return response.data;
  } catch (error) {
    const errorMsg = handleError(error, 'getTestSummary');
    throw new Error(errorMsg);
  }
};

