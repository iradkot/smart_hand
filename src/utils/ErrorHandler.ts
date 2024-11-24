import axios, { AxiosError } from 'axios';

interface CodedError extends Error {
  code?: string | number;
}

/**
 * Extracts the file location (file path, line, column) from an error's stack trace.
 * @param error The error object.
 * @returns A string representing the location, e.g., " (file.ts:10:5)", or an empty string if not found.
 */
function extractErrorLocation(error: Error): string {
  if (!error.stack) return '';

  const stackLines = error.stack.split('\n');
  const tsStackLine = stackLines.find(line => line.includes('.ts'));

  if (tsStackLine) {
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
 * Formats an AxiosError with proper indentation and line breaks.
 * @param error The AxiosError object.
 * @param context A string describing the context in which the error occurred.
 * @param indent A string representing the current indentation.
 * @returns A formatted error message string.
 */
function formatAxiosError(error: AxiosError, context: string, indent = ''): string {
  const lines: string[] = [];
  const statusCode = error.response?.status;
  const statusText = error.response?.statusText;
  const errorCode = error.code;
  const errorDetails = typeof error.response?.data === 'object' ? JSON.stringify(error.response?.data, null, 2) : error.response?.data || error.message;
  const location = extractErrorLocation(error);

  lines.push(`${indent}AxiosError${location}: ${errorDetails}`);

  if (errorCode) {
    lines.push(`${indent}  (code: ${errorCode})`);
  }

  if (statusCode) {
    lines.push(`${indent}  (status: ${statusCode} ${statusText || ''})`);
  }

  if (error.cause) {
    lines.push(`${indent}  Caused by:`);
    lines.push(handleError(error.cause, context, indent + '    '));
  }

  return lines.join('\n');
}

/**
 * Formats a standard Error with proper indentation and line breaks.
 * @param error The Error object.
 * @param context A string describing the context in which the error occurred.
 * @param indent A string representing the current indentation.
 * @returns A formatted error message string.
 */
function formatStandardError(error: CodedError, context: string, indent = ''): string {
  const lines: string[] = [];
  const location = extractErrorLocation(error);
  lines.push(`${indent}Error${location} in ${context}: ${error.message}`);

  if (error.code) {
    lines.push(`${indent}  (code: ${error.code})`);
  }

  if (error.cause) {
    lines.push(`${indent}  Caused by:`);
    lines.push(handleError(error.cause, context, indent + '    '));
  }

  return lines.join('\n');
}

/**
 * Handles formatting of unknown error types, including AggregateError and non-Error objects.
 * @param error The unknown error object.
 * @param context A string describing the context in which the error occurred.
 * @param indent A string representing the current indentation.
 * @returns A formatted error message string.
 */
export function handleError(error: unknown, context: string, indent = ''): string {
  const lines: string[] = [];

  if (error instanceof AggregateError) {
    lines.push(`${indent}AggregateError in ${context}:`);
    error.errors.forEach((err, idx) => {
      lines.push(`${indent}  Error ${idx + 1}:`);
      if (axios.isAxiosError(err)) {
        lines.push(formatAxiosError(err, context, indent + '    '));
      } else if (err instanceof Error) {
        lines.push(formatStandardError(err as CodedError, context, indent + '    '));
      } else {
        lines.push(`${indent}    ${String(err)}`);
      }
    });
  } else if (axios.isAxiosError(error)) {
    lines.push(formatAxiosError(error, context, indent));
  } else if (error instanceof Error) {
    lines.push(formatStandardError(error as CodedError, context, indent));
  } else if (typeof error === 'object' && error !== null) {
    try {
      lines.push(`${indent}Non-Error object in ${context}:\n${indent}  ${JSON.stringify(error, null, 2)}`);
    } catch {
      lines.push(`${indent}Non-Error object in ${context}: Unable to stringify error object.`);
    }
  } else {
    lines.push(`${indent}Unknown error type in ${context}: ${String(error)}`);
  }

  return lines.join('\n');
}
