// flows/fileAnalysisFlow.ts

import { readFileImports } from '../utils/fileUtils';
import { FileAnalysisResult } from '../types';

export async function fileAnalysisFlow(params: {
  directoryPath: string;
  fileName: string;
}): Promise<FileAnalysisResult> {
  const { directoryPath, fileName } = params;
  const imports = await readFileImports(directoryPath, fileName);

  // Example: quick check if we see 'react' import
  const isReactComponent = imports.some((imp) => imp.source.toLowerCase().includes('react'));

  return {
    imports,
    isReactComponent,
  };
}
