// examples/utils/exampleUtils.ts

/**
 * Sums all numbers in an array.
 * @param numbers Array of numbers to sum.
 * @returns The sum of all numbers.
 */
export function sumArray(numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Checks if a string is a palindrome.
 * @param str The string to check.
 * @returns True if the string is a palindrome, false otherwise.
 */
export function isPalindrome(str: string): boolean {
  const sanitized = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return sanitized === sanitized.split('').reverse().join('');
}

/**
 * Finds the maximum number in an array.
 * @param numbers Array of numbers.
 * @returns The maximum number.
 */
export function findMax(numbers: number[]): number {
  return Math.max(...numbers);
}

/**
 * Capitalizes the first letter of each word in a string.
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}
