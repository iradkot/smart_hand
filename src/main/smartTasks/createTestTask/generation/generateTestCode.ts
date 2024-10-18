// createTestTask/generation/generateTestCode.ts

import { TestState } from '../types';
import {findFilesInNode} from "../../../../utils/harvesterUtils/findFilesInNode/findFilesInNode";
import {ContentNode} from "../../../../types/pathHarvester.types";
import {generateTestFile} from "../../../../api/requests/aiOperationsRequests";

export async function generateTestCode(
  sessionId: string,
  prompt: string,
  fileContent: string,
  contentTree: ContentNode,
  state: TestState
): Promise<void> {
  const response = await generateTestFile(sessionId, fileContent, prompt);
  const { content } = response;
  state.testCode = content.testCode;

  if (content.requestedFiles && content.requestedFiles.length > 0) {
    state.additionalFilesContent = findFilesInNode(content.requestedFiles, contentTree);
  }
}
