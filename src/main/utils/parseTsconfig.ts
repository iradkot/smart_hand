// src/main/utils/parseTsconfig.ts
import fs from 'fs';
import path from 'path';

interface TsConfigPaths {
  [alias: string]: string[]; // e.g. "components/*": ["components/*"]
}

export interface TsconfigInfo {
  baseUrl?: string;       // e.g. "./src"
  paths?: TsConfigPaths;  // e.g. { "@utils/*": ["utils/*"] }
}

/**
 * Read and parse a tsconfig.json at the given path
 */
export function parseTsconfig(tsconfigPath: string): TsconfigInfo {
  if (!fs.existsSync(tsconfigPath)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(tsconfigPath, 'utf-8');
    const json = JSON.parse(raw);
    const compilerOptions = json.compilerOptions || {};
    const baseUrl = compilerOptions.baseUrl || undefined;
    const paths = compilerOptions.paths || undefined;

    return { baseUrl, paths };
  } catch (err) {
    console.error('Error parsing tsconfig.json:', err);
    return {};
  }
}
