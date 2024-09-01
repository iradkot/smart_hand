export function handleError(error: unknown, context: string): string {
  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = `${context}: ${error.message}`;
  } else {
    errorMessage = `${context}: ${String(error)}`;
  }
  console.error(errorMessage);
  return errorMessage;
}
