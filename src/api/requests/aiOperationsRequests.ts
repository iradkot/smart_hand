import { smartHandServer } from '../axiosInstances'

export const askGPTPost = async (sessionId: string, input: string): Promise<any> => {
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
): Promise<any> => {
  try {
    const response = await smartHandServer.post('/ai/generateTestFile', {
      sessionId,
      fileContent,
      instructions,
    });
    return response.data;
  } catch (error) {
    console.log('Error in generateTestFile:', error);
    throw error;
  }
};


export const generateTerminalCommands = async (sessionId: string, input: string): Promise<any> => {
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

