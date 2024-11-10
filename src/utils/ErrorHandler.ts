// src/utils/ErrorHandler.ts

import axios, { AxiosError } from 'axios';

interface CodedError extends Error {
  code?: string | number;
}

/**
 * Extracts the first relevant line from the error stack trace.
 * Assumes that source-map-support has mapped the stack trace to TypeScript files.
 */
function extractErrorLocation(error: Error): string {
  if (!error.stack) return '';

  // Split stack trace into lines
  const stackLines = error.stack.split('\n');

  // Find the first stack line that points to a .ts file
  const tsStackLine = stackLines.find(line => line.includes('.ts'));

  if (tsStackLine) {
    // Use regex to extract file path, line number, and column number
    const regex = /\(?([^\s:()]+\.ts):(\d+):(\d+)\)?$/;
    const match = tsStackLine.match(regex);

    if (match) {
      const [, filePath, line, column] = match;
      return ` (${filePath}:${line}:${column})`;
    }
  }

  return '';
}

/**
 * Formats AxiosError with relevant details and source location.
 */
function formatAxiosError(error: AxiosError, context: string): string {
  const statusCode = error.response?.status;
  const statusText = error.response?.statusText;
  const errorCode = error.code;
  const errorDetails = error.response?.data || error.message;
  const location = extractErrorLocation(error);

  let message = `AxiosError${location}: ${errorDetails}`;

  if (errorCode) {
    message += ` (code: ${errorCode})`;
  }

  if (statusCode) {
    message += ` (status: ${statusCode} ${statusText || ''})`;
  }

  if (error.cause) {
    const causeMessage = handleError(error.cause, context);
    message += `; caused by ${causeMessage}`;
  }

  return message;
}

/**
 * Formats standard Error with relevant details and source location.
 */
function formatStandardError(error: CodedError, context: string): string {
  const location = extractErrorLocation(error);
  let message = `Error${location} in ${context}: ${error.message}`;

  if (error.code) {
    message += ` (code: ${error.code})`;
  }

  if (error.cause) {
    const causeMessage = handleError(error.cause, context);
    message += `\n  Caused by: ${causeMessage}`;
  }

  return message;
}

/**
 * Main error handling function.
 */
export function handleError(error: unknown, context: string): string {
  let errorMessage: string;

  if (error instanceof AggregateError) {
    // Handle AggregateError by concatenating all individual error messages
    const aggregatedMessages = error.errors
      .map((err, idx) => {
        if (axios.isAxiosError(err)) {
          return `Error ${idx + 1}: ${formatAxiosError(err, context)}`;
        } else if (err instanceof Error) {
          return `Error ${idx + 1}: ${formatStandardError(err, context)}`;
        } else {
          return `Error ${idx + 1}: ${String(err)}`;
        }
      })
      .join('; ');
    errorMessage = `AggregateError in ${context}: ${aggregatedMessages}`;
  } else if (axios.isAxiosError(error)) {
    // Handle AxiosError instances
    errorMessage = `AxiosError in ${context}: ${formatAxiosError(error, context)}`;
  } else if (error instanceof Error) {
    // Handle standard Error instances
    errorMessage = formatStandardError(error, context);
  } else if (typeof error === 'object' && error !== null) {
    // Handle non-Error objects
    try {
      errorMessage = `Non-Error object in ${context}: ${JSON.stringify(error, null, 2)}`;
    } catch {
      errorMessage = `Non-Error object in ${context}: Unable to stringify error object.`;
    }
  } else {
    // Handle primitive types
    errorMessage = `Unknown error type in ${context}: ${String(error)}`;
  }

  // console.error(error);
  return errorMessage;
}
