import { clipboard } from 'electron';
import { FileHandler } from './utils/FileHandler';
import * as path from 'path';
import { CopyOptions, CopyOptionHandler } from './utils/CopyOptionHandler';
import { UserInterface } from './utils/UserInterface';
import { IgnoreList } from './utils/IgnoreList';
import { Logger } from './utils/Logger';
import fs from "fs";

export default class Copier {
  private folderStructure: string[] = [];
  private ignoredFiles: string[] = [];
  private processedPaths: Set<string> = new Set();  // To track processed paths
  private fileEntries: string[] = [];  // Store file content entries
  private initialDirectoryPath: string = '';

  constructor(
    private fileHandler: FileHandler,
    private ui: UserInterface,
    private ignoreList: IgnoreList,
    private logger: Logger
  ) {}


  private async processItem(
      itemPath: string,
      relativeItemPath: string,
      option: CopyOptions,
      depth: number = 0,
      isLast: boolean = false
  ) {
      const normalizedItemPath = path.normalize(itemPath);
      this.logger.debug(`Processing item: ${normalizedItemPath}, Relative path: ${relativeItemPath}`);
      if (this.processedPaths.has(normalizedItemPath)) {
        this.logger.debug(`Skipping already processed item: ${normalizedItemPath}`);
        return;
      }
      this.processedPaths.add(normalizedItemPath);
    try {
      const itemStat = await this.fileHandler.stat(itemPath);
      if (this.ignoreList.shouldIgnore(itemPath)) {
        this.logger.debug(`Ignoring item: ${itemPath}`);
        this.addToIgnoreList(itemStat, relativeItemPath, depth, isLast);
        return;
      }
      if (itemStat.isFile()) {
        this.logger.debug(`Processing file: ${itemPath}`);
        await this.processFile(itemPath, relativeItemPath, option, depth, isLast);
      } else if (itemStat.isDirectory()) {
        this.logger.debug(`Processing directory: ${itemPath}`);
        await this.processDirectory(itemPath, relativeItemPath, option, depth, isLast);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error processing item ${itemPath}: ${error.message}`);
      } else {
        this.logger.error(`Error processing item ${itemPath}: Unknown error occurred`, String(error));
      }
    }
  }



  private async processFile(
    itemPath: string,
    relativeItemPath: string,
    option: CopyOptions,
    depth: number,
    isLast: boolean
  ) {
    const prefix = this.createIndentationString(depth, isLast);
    const relativePathWithFileName = `${relativeItemPath}`;
    const fileName = path.basename(itemPath);
    this.logger.debug(`Adding file to folder structure: ${relativePathWithFileName}`);
    this.folderStructure.push(`${prefix}${fileName}\n`);

    if (option === CopyOptions.CopyFileContents) {
      this.logger.debug(`Reading file content: ${itemPath}`);
      await this.readFileAndAddToEntries(itemPath, relativePathWithFileName);
      this.logger.debug(`File content read: ${itemPath}`);
    }
  }


  private async processDirectory(
    directoryPath: string,
    relativeItemPath: string,
    option: CopyOptions,
    depth: number,
    isLast: boolean
  ) {
    const prefix = this.createIndentationString(depth, isLast);
    this.logger.debug(`Adding directory to folder structure: ${relativeItemPath}`);
    const folderName = path.basename(directoryPath);

    this.folderStructure.push(`${prefix}${folderName}/\n`);

    const copyContents = await this.ui.confirm(`Do you want to copy the contents of the folder? ${relativeItemPath}`);
    if (copyContents) {
      this.logger.debug(`Copying directory contents: ${directoryPath}`);
      await this.copyDirectoryContents(directoryPath, option, depth + 1, directoryPath);
    }
  }


  private addToIgnoreList(itemStat: fs.Stats, relativeItemPath: string, depth: number, isLast: boolean) {
    const prefix = this.createIndentationString(depth, isLast);
    this.logger.debug(`Adding to ignore list: ${relativeItemPath}`);
    if (itemStat.isFile()) {
      this.ignoredFiles.push(`${prefix}${relativeItemPath}\n`);
    } else if (itemStat.isDirectory()) {
      this.folderStructure.push(`${prefix}${relativeItemPath}/\n`);
    }
  }

  private async copyDirectoryContents(
    directoryPath: string,
    option: CopyOptions,
    depth: number,
  ): Promise<void> {
    this.logger.debug(`Reading directory: ${directoryPath}`);
    const items = await this.fileHandler.readDir(directoryPath);
    this.logger.debug(`Found items in directory: ${items.join(', ')}`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPath = path.join(directoryPath, item);
      const normalizedBasePath = path.normalize(this.initialDirectoryPath);
      const normalizedItemPath = path.normalize(itemPath);
      let relativeItemPath = path.relative(normalizedBasePath, normalizedItemPath);

      // If the relative path does not include the desired root folder, prepend it manually
      if (!relativeItemPath.startsWith(path.basename(this.initialDirectoryPath))) {
        relativeItemPath = path.join(path.basename(this.initialDirectoryPath), relativeItemPath);
      }

      const isLast = i === items.length - 1;

      this.logger.debug(`Processing item in directory: ${itemPath}`);
      await this.processItem(normalizedItemPath, relativeItemPath, option, depth, isLast);
    }
  }

  private readonly branchSymbols = {
    vertical: "│   ",
    standard: "├── ",
    last: "└── ",
  };

  private createIndentationString(level: number, isLastItem: boolean): string {
    // Build an indentation string based on the item level and if it's the last item
    const indentations = Array(level).fill(this.branchSymbols.vertical); // Fill with vertical symbols

    // Append the appropriate symbol for the last item or standard item
    indentations.push(isLastItem ? this.branchSymbols.last : this.branchSymbols.standard);

    return indentations.join(""); // Join the symbols into a single string
  }


  private async readFileAndAddToEntries(
    itemPath: string,
    relativeItemPath: string
  ) {
    this.logger.debug(`Reading and adding file to entries: ${itemPath}`);
    const fileContent = await this.fileHandler.readFile(itemPath);
    this.logger.debug(`Relative path with file name: ${relativeItemPath}`);
    this.fileEntries.push(`${relativeItemPath}\n${fileContent}\n`);
    this.logger.debug(`File content added`);
  }

  private buildClipboardContent(
    directoryPath: string,
    option: CopyOptions
  ): string {
    this.logger.debug(`Building clipboard content for directory: ${directoryPath}`);
    const content = CopyOptionHandler.buildContent(
      directoryPath,
      this.folderStructure,
      this.ignoredFiles,
      this.fileEntries,
      option
    );
    this.logger.debug(`Clipboard content built successfully: ${content}`);
    return content;
  }

  async startCopyingProcess(directoryPath: string, option: CopyOptions): Promise<string> {
    this.initialDirectoryPath = directoryPath;
    this.logger.info(`Starting copy process for directory: "${directoryPath}" with option: "${option}"`);

    const initialStat = await this.fileHandler.stat(directoryPath);
    if (initialStat.isFile()) {
      this.logger.debug(`Directory path is a file, processing single file: ${directoryPath}`);
      return this.processSingleFile(directoryPath, option);
    }

    this.logger.debug(`Resetting copy state for new directory`);
    this.resetCopyState();

    await this.copyDirectoryContents(directoryPath, option, 0);

    const content = this.buildContentForReturn(directoryPath, option);
    this.logger.debug(`Final content to return: ${content}`);

    return content; // Return the content instead of copying it
  }

  private async processSingleFile(filePath: string, option: CopyOptions): Promise<string> {
    this.logger.debug(`Processing single file: ${filePath}`);
    const fileContent = await this.fileHandler.readFile(filePath);
    const clipboardContent = CopyOptionHandler.buildContentForFile(filePath, fileContent, option);
    this.logger.debug(`Copying single file content to clipboard: ${clipboardContent}`);
    clipboard.writeText(clipboardContent);
    this.logger.debug(`Single file copied to clipboard successfully`);
    return 'Data copied to clipboard successfully';
  }

  private resetCopyState() {
    this.logger.debug(`Resetting folder structure, ignored files lists, and file entries`);
    this.folderStructure = [];
    this.ignoredFiles = [];
    this.fileEntries = [];  // Reset file entries
    this.processedPaths.clear();  // Clear the set of processed paths
  }

  private buildContentForReturn(directoryPath: string, option: CopyOptions): string {
    this.logger.debug(`Building content for directory: ${directoryPath}`);
    const content = this.buildClipboardContent(directoryPath, option);
    this.logger.debug(`Content built successfully: ${content}`);
    return content;
  }
}
