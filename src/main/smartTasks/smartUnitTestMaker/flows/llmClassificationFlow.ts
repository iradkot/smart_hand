// llmClassificationFlow.ts
import { classifyFile } from 'src/api/requests/aiOperationsRequests';
import { classificationPrompt } from '../prompts/classificationPrompt';
import { FileAnalysisResult, LlmClassificationResult } from '../types';

export async function llmClassificationFlow(params: {
  sessionId: string;
  fileContent: string;
  analysis: FileAnalysisResult;
}): Promise<LlmClassificationResult> {
  const { sessionId, fileContent, analysis } = params;
  const instructions = classificationPrompt(fileContent, analysis);

  // calls the new endpoint
  const result = await classifyFile(sessionId, fileContent, instructions);

  // Format the result for returning a LlmClassificationResult
  // Because classifyFile returns { fileType?: string; mocksNeeded?: string[]; }
  return {
    fileType: result.fileType || 'Unknown',
    mocksNeeded: result.mocksNeeded || [],
  };
}
