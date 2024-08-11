export class IgnoreList {
  private readonly ignoreList: Set<string>;

  constructor(ignoredItems: string[]) {
    this.ignoreList = new Set(ignoredItems);
  }

  shouldIgnore(itemPath: string): boolean {
    return this.ignoreList.has(itemPath);
  }
}
