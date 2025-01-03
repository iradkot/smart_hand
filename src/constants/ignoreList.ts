export const IGNORE_LIST = [
  'node_modules',
  '.git',
  'yarn.lock',
  'package-lock.json',
  '.idea',
  '.vscode',
  'build',
  'out',
  'resources',
  'dist',
  'coverage',
  'ts_resolution.log',
  '.firebase'
];

export const ALLOWED_WHITELIST_EXTENSIONS = [
  // Core web / Node / JS / TS / config
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".jsonc",   // Some projects use JSON with comments
  ".yaml",
  ".yml",
  ".toml",
  ".ini",

  // Misc. text/markup
  ".md",
  ".txt",
  ".html",
  ".xml",

  // Scripting / languages beyond JS
  ".py",      // Python
  ".rb",      // Ruby
  ".sh",      // Shell scripts
  ".java",    // Java
  ".c",
  ".cpp",
  ".cxx",
  ".cs",      // C#
  ".rs",      // Rust
  ".go",      // Go
  ".scala",

  // Env files
  ".env",
]
