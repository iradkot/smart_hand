// utils/Logger.ts
import { inspect } from 'util';

class Logger {
  info(message: string, metadata: Record<string, any> = {}) {
    console.log(`[INFO]: ${message}`, inspect(metadata, { depth: null, colors: true }));
  }

  error(message: string, error?: unknown) {
    if (error instanceof Error) {
      console.error(`${message}: ${error.message}`);
    } else {
      console.error(`${message}: ${String(error)}`);
    }
  }

  debug(message: string, metadata: Record<string, any> = {}) {
    console.log(`[DEBUG]: ${message}`, inspect(metadata, { depth: null, colors: true }));
  }
}

export const logger = new Logger();
