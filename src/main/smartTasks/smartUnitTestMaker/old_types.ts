// types.ts

export interface FileAnalysisResult {
  imports: ImportEntry[];
  isReactComponent?: boolean;
  // TODO: Add more structural flags if you need them
}

export interface ImportEntry {
  source: string;    // e.g., 'react' or './someLocalFile'
  raw: string;       // raw import line, if desired
  // TODO: any more metadata you want about imports
}

export interface LlmClassificationResult {
  fileType: string;       // e.g. "ReactComponent", "NodeUtility", "Unknown"
  mocksNeeded: string[];  // e.g. ["axios", "./someLocalFile"]
  // TODO: add more for advanced usage
}

export interface TestGenerationResult {
  testFileName: string;
  testCode: string;
}

export interface TestResult {
  success: boolean;
  errorMessage?: string;
  details?: any;  // optional: store jest or mocha test details
}

// The context for our XState machine:
export interface TestMakerContext {
  // Inputs
  sessionId: string;
  directoryPath: string;
  fileName: string;
  fileContent: string;
  packageManager: string;

  // Results stored along the way:
  analysis: FileAnalysisResult | null;
  classification: LlmClassificationResult | null;
  testGeneration: TestGenerationResult | null;
  testResult: TestResult | null;

  // Control how many times we can retry
  retries: number;
  maxRetries: number;

  // Error tracking
  error: unknown | null;
}
// types.ts (or wherever you define your types)

export type TestMakerInput = {
  sessionId: string;
  directoryPath: string;
  fileName: string;
  fileContent: string;
  packageManager: string;
};

export type TestMakerEvent =
  | { type: 'done.invoke.analyzeFile'; output: FileAnalysisResult }
  | { type: 'error.platform.analyzeFile'; data: any }
  | { type: 'done.invoke.classifyFile'; output: LlmClassificationResult }
  | { type: 'error.platform.classifyFile'; data: any }
  | { type: 'done.invoke.generateTest'; output: TestGenerationResult }
  | { type: 'error.platform.generateTest'; data: any }
  | { type: 'done.invoke.executeTest'; output: TestResult }
  | { type: 'error.platform.executeTest'; data: any }
  | { type: 'done.invoke.fixTestFailure'; output: TestResult }
  | { type: 'error.platform.fixTestFailure'; data: any };

