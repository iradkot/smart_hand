import * as fs from 'fs/promises';
import * as path from 'path';
import * as ts from 'typescript'; // TypeScript Compiler API
import { IGNORE_LIST } from '../../constants/ignoreList';

const TS_FILE_EXTENSIONS = ['.ts', '.tsx', '.d.ts'];

interface SearchResult {
  collectedTypes: string;
  totalChars: number;
}

async function gatherTypesAndInterfaces(
  startDir: string,
  maxDepth: number,
  charLimit: number
): Promise<string> {
  let result: SearchResult = { collectedTypes: '', totalChars: 0 };

  console.log(`Starting search in directory: ${startDir} with maxDepth: ${maxDepth} and charLimit: ${charLimit}`);

  try {
    await searchFolder(startDir, 0, maxDepth, charLimit, result);
  } catch (error) {
    console.error(`Error during search: ${error.message}`);
  }

  console.log(`Finished search with collected characters: ${result.totalChars}`);
  return result.collectedTypes;
}

async function searchFolder(
  dir: string,
  currentDepth: number,
  maxDepth: number,
  charLimit: number,
  result: SearchResult
): Promise<void> {
  if (currentDepth > maxDepth || result.totalChars >= charLimit) {
    console.log(`Reached max depth or character limit. Stopping search at ${dir}`);
    return;
  }

  console.log(`Searching directory: ${dir} at depth ${currentDepth}`);

  try {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dir, file.name);

      if (shouldIgnore(file.name)) {
        console.log(`Skipping ignored path: ${filePath}`);
        continue;
      }

      if (file.isDirectory()) {
        await searchFolder(filePath, currentDepth + 1, maxDepth, charLimit, result);
      } else if (file.isFile() && isTypeScriptFile(file.name)) {
        console.log(`Processing TypeScript file: ${filePath}`);
        await processTypeScriptFile(filePath, charLimit, result);
      }

      if (result.totalChars >= charLimit) {
        console.log(`Character limit reached: ${result.totalChars}`);
        return;
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`);
  }
}

async function processTypeScriptFile(filePath: string, charLimit: number, result: SearchResult): Promise<void> {
  try {
    const content = await fs.readFile(filePath, 'utf8');

    console.log(`Reading file: ${filePath}`);

    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
    const types = collectTypesFromSourceFile(sourceFile);

    if (types.length > 0) {
      console.log(`Found types in file: ${filePath}`);
    } else {
      console.log(`No types found in file: ${filePath}`);
    }

    for (const type of types) {
      if (result.totalChars + type.length <= charLimit) {
        result.collectedTypes += type + '\n';
        result.totalChars += type.length;
      } else {
        console.log(`Stopping due to char limit at file: ${filePath}`);
        return; // Stop further processing if char limit is reached
      }
    }

    await processImports(filePath, content, charLimit, result);
  } catch (error) {
    console.error(`Error processing TypeScript file ${filePath}: ${error.message}`);
  }
}

function collectTypesFromSourceFile(sourceFile: ts.SourceFile): string[] {
  const types: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      const typeOrInterface = node.getText(sourceFile);
      types.push(typeOrInterface);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return types;
}

async function processImports(filePath: string, content: string, charLimit: number, result: SearchResult): Promise<void> {
  const importRegex = /import.*from\s+['"](.+?)['"]/g;
  const importMatches = [...content.matchAll(importRegex)];

  for (const match of importMatches) {
    let importPath = match[1];

    if (!importPath.startsWith('.')) continue; // Skip non-relative imports

    importPath = path.resolve(path.dirname(filePath), importPath);

    const fileStat = await safeStat(importPath);
    if (fileStat?.isFile() && isTypeScriptFile(importPath)) {
      console.log(`Processing imported file: ${importPath}`);
      await processTypeScriptFile(importPath, charLimit, result);
    } else if (fileStat?.isDirectory()) {
      const indexPath = path.join(importPath, 'index.ts');
      const indexStat = await safeStat(indexPath);
      if (indexStat?.isFile()) {
        console.log(`Processing index file: ${indexPath}`);
        await processTypeScriptFile(indexPath, charLimit, result);
      } else {
        console.log(`Searching folder for types in: ${importPath}`);
        await searchFolder(importPath, 0, 1, charLimit, result); // Search in directory for types
      }
    }
  }
}

async function safeStat(filePath: string): Promise<fs.Stats | null> {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
}

function isTypeScriptFile(fileName: string): boolean {
  return TS_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

function shouldIgnore(fileOrDir: string): boolean {
  return IGNORE_LIST.includes(fileOrDir);
}

export default gatherTypesAndInterfaces;
