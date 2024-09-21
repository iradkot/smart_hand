import { sumArray, isPalindrome } from './exampleUtils';

describe('Utility Functions', () => {
  let numbers: number[];

  // Set up common test data
  beforeAll(() => {
    numbers = [1, 2, 3, 4];
  });

  // Resetting mocks or state before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sumArray', () => {
    test('sums an array of positive numbers', () => {
      expect(sumArray(numbers)).toBe(10);
    });

    test('sums an array with negative numbers', () => {
      expect(sumArray([-1, -2, 3, 4])).toBe(4);
    });

    test('returns 0 for an empty array', () => {
      expect(sumArray([])).toBe(0);
    });

    // Parameterized test to handle multiple scenarios
    test.each([
      [[1, 2, 3], 6],
      [[-1, 0, 1], 0],
      [[10, 20, 30], 60],
    ])('sums different arrays %p', (array, expected) => {
      expect(sumArray(array)).toBe(expected);
    });
  });

  describe('isPalindrome', () => {
    test('identifies a palindrome', () => {
      expect(isPalindrome('racecar')).toBe(true);
    });

    test('identifies a non-palindrome', () => {
      expect(isPalindrome('hello')).toBe(false);
    });

    // Test case for ignoring case and non-alphanumeric characters
    test('ignores case and non-alphanumeric characters', () => {
      expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
    });

    // Advanced custom matcher for palindromes
    expect.extend({
      toBePalindrome(received) {
        const pass = isPalindrome(received);
        if (pass) {
          return {
            message: () => `expected "${received}" not to be a palindrome`,
            pass: true,
          };
        } else {
          return {
            message: () => `expected "${received}" to be a palindrome`,
            pass: false,
          };
        }
      },
    });

    test('uses a custom palindrome matcher', () => {
      // @ts-ignore
      expect('madam').toBePalindrome(); // Using custom matcher
    });

    // Cleanup after tests if needed
    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
