/**
 * Checks if the current environment is WSL (Windows Subsystem for Linux).
 * @returns {boolean} - True if running in WSL, false otherwise.
 */
function isWSL(): boolean {
  return (
    process.platform === 'linux' &&
    process.env['WSL_DISTRO_NAME'] !== undefined
  );
}

/**
 * Normalizes a given path based on the running environment.
 * Converts Windows paths to POSIX paths if running in WSL.
 * @param {string} inputPath - The original path.
 * @returns {string} - The normalized path.
 */
export function normalizePath(inputPath: string): string {
  if (isWSL()) {
    // Convert Windows path to WSL (POSIX) path
    // Example: "C:\Users\irad1\projects\smart_hand" -> "/mnt/c/Users/irad1/projects/smart_hand"
    const windowsPathPattern = /^([a-zA-Z]):\\(.*)/;
    const match = windowsPathPattern.exec(inputPath);
    if (match) {
      const driveLetter = match[1].toLowerCase();
      const pathWithoutDrive = match[2].replace(/\\/g, '/');
      return `/mnt/${driveLetter}/${pathWithoutDrive}`;
    }
  }
  // If not WSL, return the original path
  return inputPath;
}
