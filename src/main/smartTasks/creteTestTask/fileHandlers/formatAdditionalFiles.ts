// createTestTask/fileHandlers/formatAdditionalFiles.ts

export function formatAdditionalFiles(additionalFilesContent: Record<string, string>): string {
  if (!additionalFilesContent || Object.keys(additionalFilesContent).length === 0) {
    return '';
  }

  let additionalFilesSection = '### Additional Files Provided:\n';
  for (const [filePath, content] of Object.entries(additionalFilesContent)) {
    additionalFilesSection += `\n**${filePath}:**\n\`\`\`typescript\n${content}\n\`\`\`\n`;
  }
  return additionalFilesSection;
}
