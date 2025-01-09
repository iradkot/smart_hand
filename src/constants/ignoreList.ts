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
  ".js",
  ".jsx",
  '.mjs',
  '.cjs',
  ".ts",
  ".tsx",
  ".json",
  ".jsonc",
  ".yaml",
  ".yml",
  ".toml",
  ".ini",
  ".md",
  ".txt",
  ".html",
  ".xml",
  ".py",
  ".rb",
  ".sh",
  ".java",
  ".c",
  ".cpp",
  ".cxx",
  ".cs",
  ".css",
  ".scss",
  ".rs",
  ".go",
  ".scala",
  ".env",
  // ".lock", // optional
]

export const ALLOWED_FILE_NAMES = [
  // ESLint
  ".eslintrc",
  ".eslintignore",

  // Prettier
  ".prettierrc",
  ".prettierignore",

  // Editor
  ".editorconfig",

  // Babel
  ".babelrc",

  // Git
  ".gitignore",
  ".gitattributes",
  ".gitmodules",

  // Node / NPM / Yarn
  ".nvmrc",
  ".npmrc",
  ".yarnrc",
  ".yarnrc.yml",

  // StyleLint
  ".stylelintrc",
  ".stylelintignore",

  // Docker
  ".dockerignore",
  // "Dockerfile", // If you want to parse Dockerfile

  // Lint-staged, commitlint, husky
  ".commitlintrc",
  ".commitlintignore",
  ".huskyrc",
  ".lintstagedrc",

  // Release, browserslist
  ".releaserc",
  ".browserslistrc",

  // SWC
  ".swcrc",

  // Env variants (sometimes used as dotfiles)
  ".env.local",
  ".env.production",
  ".env.development",
  // etc.

  // More...
]

