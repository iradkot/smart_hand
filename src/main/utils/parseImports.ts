// parseImports.ts
import fs from 'fs';
import path from 'path';
import { TsconfigInfo } from './parseTsconfig';
import { resolveFilePath } from './resolveFilePath';

const defaultExtensions = [ '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs' ];

export function parseImportsWithTsconfig(
  filePath: string,
  projectRoot: string,  // e.g. /Users/irad/.../theProject
  tsconfig: TsconfigInfo // e.g. { baseUrl: "./src", paths: { "@utils/*": ... } }
): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex =
    /import\s+.*?\s+from\s+['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/g;

  let match: RegExpExecArray | null;
  const rawImports: string[] = [];
  while ((match = importRegex.exec(content)) !== null) {
    const captured = match[1] || match[2];
    if (captured) rawImports.push(captured);
  }

  const currentDir = path.dirname(filePath);
  const resolvedPaths: string[] = [];

  // We'll define a small helper to detect if it's an external package
  function isExternalPackage(importStr: string) {
    // If it doesn't start with '.' or '/', and isn't matched by tsconfig paths
    // we treat it as external
    if (importStr.startsWith('.') || importStr.startsWith('/')) return false;

    // If we do have "paths" in tsconfig, we might see if it matches
    // but let's keep it simple: if there's no slash at all, it's likely external
    // e.g. 'react', 'lodash', 'electron'
    if (!importStr.includes('/')) {
      return true;
    }
    return false;
  }

  for (const rawImport of rawImports) {
    // skip external
    if (isExternalPackage(rawImport)) {
      continue;
    }

    let rawFull: string | null = null;

    // 1) If relative
    if (rawImport.startsWith('.') || rawImport.startsWith('/')) {
      // relative or absolute
      rawFull = rawImport.startsWith('.')
        ? path.resolve(currentDir, rawImport) // relative
        : rawImport; // absolute from root
    } else {
      // 2) Possibly an alias from tsconfig "paths" or at least baseUrl
      rawFull = resolveAliasImport(rawImport, projectRoot, tsconfig);
    }

    if (!rawFull) continue;

    // 3) Attempt to find an actual file path with the extension
    const finalPath = resolveFilePath(rawFull, defaultExtensions);
    if (finalPath) {
      resolvedPaths.push(finalPath);
    }
  }

  return resolvedPaths;
}

/**
 * Given an import like "components/Foo", "myAlias/utils" etc., try to resolve
 * based on baseUrl or "paths" from tsconfig. If no match, fallback to
 * path.join(projectRoot, rawImport).
 */
function resolveAliasImport(
  rawImport: string,
  projectRoot: string,
  tsconfig: TsconfigInfo
): string | null {
  const baseUrl = tsconfig.baseUrl || '.';
  // If we do something like path.join(projectRoot, baseUrl, rawImport):
  // e.g. "/Users/iradkotton/projects/smart_hand" + "./src" + "components/Foo"

  // If you wanted to handle "paths":
  //  e.g. "@utils/*": ["utils/*"]
  // That requires more advanced matching logic:
  //  - see if rawImport matches "@utils/xxx"
  //  - replace with "utils/xxx"
  // For brevity, we skip the full logic here.
  // We'll do a simpler approach: If rawImport doesn't contain node_modules
  // or look external, we do:

  const fullPath = path.join(projectRoot, baseUrl, rawImport);
  return fullPath;
}
