// flows/fileAnalysisFlow.ts

import { FileAnalysisParams, FileAnalysisResult, ImportEntry, MockDefinition } from '../types/flows';
import { findOrCreateMock } from '../utils/mockUtils';
import * as parser from '@typescript-eslint/parser';
import * as fs from 'fs';
import * as path from 'path';

interface ComplexityMetrics {
  cyclomaticComplexity: number;
  dependencyCount: number;
  hasAsyncOperations: boolean;
  hasStateManagement: boolean;
  hasEventHandling: boolean;
  importComplexity: number;
}

const calculateComplexityMetrics = (ast: any, fileContent: string): ComplexityMetrics => {
  let cyclomaticComplexity = 0;
  let dependencyCount = 0;
  let hasAsyncOperations = false;
  let hasStateManagement = false;
  let hasEventHandling = false;
  let importComplexity = 0;

  function walk(node: any) {
    if (!node || typeof node !== 'object') return;

    // Cyclomatic complexity
    if (['IfStatement', 'WhileStatement', 'ForStatement', 'SwitchCase', '&&', '||'].includes(node.type)) {
      cyclomaticComplexity++;
    }

    // Async operations
    if (node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression') {
      if (node.async) hasAsyncOperations = true;
    }

    // State management
    if (node.type === 'CallExpression' && 
        (node.callee?.name?.startsWith('use') || 
         fileContent.includes('useState') || 
         fileContent.includes('useReducer'))) {
      hasStateManagement = true;
    }

    // Event handling
    if (node.type === 'JSXAttribute' && node.name.name.startsWith('on')) {
      hasEventHandling = true;
    }

    // Import complexity
    if (node.type === 'ImportDeclaration') {
      dependencyCount++;
      if (node.specifiers?.length > 3) importComplexity++;
      if (node.specifiers?.some((s: any) => s.type === 'ImportNamespaceSpecifier')) importComplexity++;
    }

    // Recursively walk children
    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        walk(node[key]);
      }
    }
  }

  walk(ast);

  return {
    cyclomaticComplexity,
    dependencyCount,
    hasAsyncOperations,
    hasStateManagement,
    hasEventHandling,
    importComplexity
  };
};

export async function fileAnalysisFlow(params: FileAnalysisParams): Promise<FileAnalysisResult> {
  const { directoryPath, fileName } = params;
  const filePath = path.join(directoryPath, fileName);
  const fileContent = await fs.promises.readFile(filePath, 'utf8');

  // Parse the file to get AST
  const ast = parser.parse(fileContent, {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    }
  });

  const metrics = calculateComplexityMetrics(ast, fileContent);
  
  // Extract imports
  const imports: ImportEntry[] = [];
  const mockSet = new Set<MockDefinition>();

  // Analyze complexity and determine if AI is needed
  const needsAIAnalysis = 
    metrics.cyclomaticComplexity > 10 ||
    metrics.dependencyCount > 5 ||
    metrics.hasAsyncOperations ||
    metrics.hasStateManagement ||
    metrics.hasEventHandling ||
    metrics.importComplexity > 2;

  // React component detection
  const isReactComponent = fileContent.includes('React.') ||
    fileContent.includes('function') && fileContent.includes('return') && fileContent.includes('jsx');

  return {
    imports,
    isReactComponent,
    requiredMocks: Array.from(mockSet),
    complexityMetrics: metrics,
    needsAIAnalysis,
    complexImports: metrics.importComplexity > 0
  };
}
