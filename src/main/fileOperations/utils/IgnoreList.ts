import path from "node:path";
import {IIgnoreList} from "../types/interfaces";

export class IgnoreList implements IIgnoreList {
  private readonly ignoreList: Set<string>;

  constructor(ignoredItems: string[]) {
    this.ignoreList = new Set(ignoredItems);
  }

  shouldIgnore(itemPath: string): boolean {
    const baseName = path.basename(itemPath);
    return this.ignoreList.has(baseName);
  }
}
