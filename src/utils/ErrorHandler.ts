export function handleError(error: unknown, context: string): string {
  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = `1${context}: ${error.message}`;
  } else if (typeof error === 'object' && error !== null) {
    // Convert the error object to a string using JSON.stringify
    errorMessage = `2${context}: ${JSON.stringify(error, null, 2)}`;
  } else {
    errorMessage = `3${context}: ${String(error)}`;
  }
  console.error(errorMessage);
  return errorMessage;
}
