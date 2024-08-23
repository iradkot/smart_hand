import fs from "fs";

export interface IFileHandler {
  readFile(filePath: string): Promise<string>;
  readDir(directoryPath: string): Promise<string[]>;
  stat(itemPath: string): Promise<fs.Stats>;
}

export interface ILogger {
  info(message: string, metadata?: Record<string, any>): void;
  error(message: string, error?: unknown): void;
  debug(message: string, metadata?: Record<string, any>): void;
}

export interface IUserInterface {
  confirm(question: string): Promise<boolean>;
}

export interface IIgnoreList {
  shouldIgnore(itemPath: string): boolean;
}
