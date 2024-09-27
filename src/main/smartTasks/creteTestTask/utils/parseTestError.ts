

function parseTestError(stderr: string): string {
  // Simple example parsing logic
  const lines = stderr.split('\n');
  const errorLines = lines.filter(line => line.includes('Error'));
  return errorLines.join('\n');
}

export default parseTestError;
