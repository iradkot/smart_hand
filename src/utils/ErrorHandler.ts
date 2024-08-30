export function handleError(error: unknown, context: string): void {
  if (error instanceof Error) {
    console.error(`${context}: ${error.message}`);
  } else {
    console.error(`${context}: ${String(error)}`);
  }
}
