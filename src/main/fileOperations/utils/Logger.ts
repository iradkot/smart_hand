export class Logger {
  info(message: string, metadata: Record<string, any> = {}) {
    console.log(`[INFO]: ${message}`, JSON.stringify(metadata));
  }

  error(message: string, metadata: Record<string, any> = {}) {
    console.error(`[ERROR]: ${message}`, JSON.stringify(metadata));
  }

  debug(message: string, metadata: Record<string, any> = {}) {
    console.debug(`[DEBUG]: ${message}`, JSON.stringify(metadata));
  }
}
