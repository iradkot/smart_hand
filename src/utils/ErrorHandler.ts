export function handleError(error: unknown, context: string): string {
  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = `1${context}: ${error.message}`;
  } else {
    errorMessage = `2${context}: ${String(error)}`;
  }
  console.error(errorMessage);
  return errorMessage;
}
