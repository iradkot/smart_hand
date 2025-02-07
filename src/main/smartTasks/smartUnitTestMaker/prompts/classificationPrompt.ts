// prompts/classificationPrompt.ts

/**
 * Builds a prompt to ask the LLM to classify a file and decide which imports need mocking.
 */
import { FileAnalysisResult } from '../types'

export function classificationPrompt(
  fileContent: string,
  analysis: FileAnalysisResult,
): string {
  return `
We have a file with the following imports:
${analysis.imports.map((imp) => imp.raw).join('\n')}

File content:
\`\`\`typescript
${fileContent}
\`\`\`

Please classify the file (e.g., "ReactComponent", "NodeUtility"...)
and decide which imports require mocking.
Return valid JSON, for example:
{
  "fileType": "ReactComponent",
  "mocksNeeded": ["axios", "./someLocalFile"]
}
`
}
