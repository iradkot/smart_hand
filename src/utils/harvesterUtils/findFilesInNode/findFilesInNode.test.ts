// findFilesInNode.test.ts

import {ContentTree, ContentNode} from "../../../types/pathHarvester.types";
// findFilesInNode.test.ts

import { findFilesInNode } from './findFilesInNode';

describe('findFilesInNode', () => {
  /**
   * Utility function to create a ContentNode directory.
   */
  const createDirectory = (path: string, children?: ContentTree): ContentNode => ({
    type: 'directory',
    localPath: path,
    children: children || {},
  });

  /**
   * Utility function to create a ContentNode file.
   */
  const createFile = (path: string, content: string): ContentNode => ({
    type: 'file',
    localPath: path,
    content,
  });

  /**
   * Mock ContentNode trees for different scenarios.
   */

    // 1. Windows-style paths with backslashes
  const windowsMockTree: ContentNode = createDirectory('C:\\Projects\\MyApp', {
      src: createDirectory('C:\\Projects\\MyApp\\src', {
        stateManagement: createDirectory('C:\\Projects\\MyApp\\src\\stateManagement', {
          zustand: createDirectory('C:\\Projects\\MyApp\\src\\stateManagement\\zustand', {
            'useStore.ts': createFile('C:\\Projects\\MyApp\\src\\stateManagement\\zustand\\useStore.ts', 'import { create } from \'zustand\';...'),
          }),
        }),
          components: createDirectory('C:\\Projects\\MyApp\\src\\components', {
          'Button.tsx': createFile('C:\\Projects\\MyApp\\src\\components\\Button.tsx', 'Button Component Content'),
          'Input.tsx': createFile('C:\\Projects\\MyApp\\src\\components\\Input.tsx', 'Input Component Content'),
        }),
        utils: createDirectory('C:\\Projects\\MyApp\\src\\utils', {
          'helpers.ts': createFile('C:\\Projects\\MyApp\\src\\utils\\helpers.ts', 'Helpers Content'),
        }),
      }),
    });

  // 2. Unix-style paths with forward slashes
  const unixMockTree: ContentNode = createDirectory('/home/user/projects/MyApp', {
    src: createDirectory('/home/user/projects/MyApp/src', {
      components: createDirectory('/home/user/projects/MyApp/src/components', {
        'Navbar.tsx': createFile('/home/user/projects/MyApp/src/components/Navbar.tsx', 'Navbar Component Content'),
        'Footer.tsx': createFile('/home/user/projects/MyApp/src/components/Footer.tsx', 'Footer Component Content'),
      }),
      utils: createDirectory('/home/user/projects/MyApp/src/utils', {
        'helpers.js': createFile('/home/user/projects/MyApp/src/utils/helpers.js', 'Helpers JS Content'),
      }),
    }),
  });

  // 3. Mixed slashes and case sensitivity
  const mixedMockTree: ContentNode = createDirectory('D:\\Work\\Project', {
    src: createDirectory('D:/Work/Project/src', {
      Components: createDirectory('D:/Work/Project/src/Components', {
        'Header.tsx': createFile('D:/Work/Project/src/Components/Header.tsx', 'Header Component Content'),
      }),
      services: createDirectory('D:\\Work\\Project\\src\\services', {
        'apiService.ts': createFile('D:\\Work\\Project\\src\\services\\apiService.ts', 'API Service Content'),
      }),
    }),
  });

  // 4. Nested directories with multiple levels
  const nestedMockTree: ContentNode = createDirectory('/var/www/html/MySite', {
    assets: createDirectory('/var/www/html/MySite/assets', {
      images: createDirectory('/var/www/html/MySite/assets/images', {
        'logo.png': createFile('/var/www/html/MySite/assets/images/logo.png', 'Logo Image Content'),
      }),
      styles: createDirectory('/var/www/html/MySite/assets/styles', {
        'main.css': createFile('/var/www/html/MySite/assets/styles/main.css', 'Main CSS Content'),
      }),
    }),
    pages: createDirectory('/var/www/html/MySite/pages', {
      'home.html': createFile('/var/www/html/MySite/pages/home.html', 'Home Page Content'),
      'about.html': createFile('/var/www/html/MySite/pages/about.html', 'About Page Content'),
    }),
  });

  /**
   * Individual Test Cases with Smaller Mock Trees
   */
  // Test Case 1: Windows-style paths
  describe('Windows-style paths', () => {
    it('should find the file useStore.ts in the zustand folder', () => {
      const paths = ['src/stateManagement/zustand/useStore.ts'];
      const expected = {
        'src/stateManagement/zustand/useStore.ts': 'import { create } from \'zustand\';...',
      };

      const result = findFilesInNode(paths, windowsMockTree);
      console.log('Result:', result);  // Log the result of the function
      expect(result).toEqual(expected);
    });

    it('should find a single existing file with backslashes', () => {
      const paths = ['src\\components\\Button.tsx'];
      const expected = {
        'src/components/Button.tsx': 'Button Component Content',
      };
      const result = findFilesInNode(paths, windowsMockTree);
      expect(result).toEqual(expected);
    });

    it('should find multiple existing files with backslashes', () => {
      const paths = [
        'src\\components\\Button.tsx',
        'src\\utils\\helpers.ts',
      ];
      const expected = {
        'src/components/Button.tsx': 'Button Component Content',
        'src/utils/helpers.ts': 'Helpers Content',
      };
      const result = findFilesInNode(paths, windowsMockTree);
      expect(result).toEqual(expected);
    });

    it('should return empty object for non-existing paths', () => {
      const paths = ['src\\components\\NonExisting.tsx'];
      const expected: Record<string, string> = {};
      const result = findFilesInNode(paths, windowsMockTree);
      expect(result).toEqual(expected);
    });
  });

  // Test Case 2: Unix-style paths
  describe('Unix-style paths', () => {
    it('should find a single existing file with forward slashes', () => {
      const paths = ['src/components/Navbar.tsx'];
      const expected = {
        'src/components/Navbar.tsx': 'Navbar Component Content',
      };
      const result = findFilesInNode(paths, unixMockTree);
      expect(result).toEqual(expected);
    });

    it('should find multiple existing files with forward slashes', () => {
      const paths = [
        'src/components/Navbar.tsx',
        'src/utils/helpers.js',
      ];
      const expected = {
        'src/components/Navbar.tsx': 'Navbar Component Content',
        'src/utils/helpers.js': 'Helpers JS Content',
      };
      const result = findFilesInNode(paths, unixMockTree);
      expect(result).toEqual(expected);
    });

    it('should return empty object for non-existing paths', () => {
      const paths = ['src/components/NonExisting.tsx'];
      const expected: Record<string, string> = {};
      const result = findFilesInNode(paths, unixMockTree);
      expect(result).toEqual(expected);
    });
  });

  // Test Case 3: Mixed slashes and case sensitivity
  describe('Mixed slashes and case sensitivity', () => {
    it('should find a file regardless of case and mixed slashes', () => {
      const paths = ['src\\components\\HEADER.tsx'];
      const expected = {
        'src/Components/Header.tsx': 'Header Component Content',
      };
      const result = findFilesInNode(paths, mixedMockTree);
      expect(result).toEqual(expected);
    });

    it('should find multiple files with mixed slashes and case variations', () => {
      const paths = [
        'src\\components\\HEADER.tsx',
        'src/services/APISERVICE.TS',
      ];
      const expected = {
        'src/Components/Header.tsx': 'Header Component Content',
        'src/services/apiService.ts': 'API Service Content',
      };
      const result = findFilesInNode(paths, mixedMockTree);
      expect(result).toEqual(expected);
    });

    it('should return empty object when case does not match any file', () => {
      const paths = ['src\\components\\nonExistent.tsx']; // Assuming exact case is required
      const expected: Record<string, string> = {};
      const result = findFilesInNode(paths, mixedMockTree);
      expect(result).toEqual(expected);
    });
  });

  // Test Case 4: Nested directories with multiple levels
  describe('Nested directories with multiple levels', () => {
    it('should find a deeply nested existing file', () => {
      const paths = ['assets/styles/main.css'];
      const expected = {
        'assets/styles/main.css': 'Main CSS Content',
      };
      const result = findFilesInNode(paths, nestedMockTree);
      expect(result).toEqual(expected);
    });

    it('should find multiple deeply nested existing files', () => {
      const paths = [
        'assets/images/logo.png',
        'pages/about.html',
      ];
      const expected = {
        'assets/images/logo.png': 'Logo Image Content',
        'pages/about.html': 'About Page Content',
      };
      const result = findFilesInNode(paths, nestedMockTree);
      expect(result).toEqual(expected);
    });

    it('should return empty object for non-existing deeply nested paths', () => {
      const paths = ['assets/fonts/font.ttf'];
      const expected: Record<string, string> = {};
      const result = findFilesInNode(paths, nestedMockTree);
      expect(result).toEqual(expected);
    });
  });

  // Test Case 5: Handling directories in paths
  describe('Handling directories in paths', () => {
    it('should ignore directories and not return their contents', () => {
      const paths = ['src\\components'];
      const expected: Record<string, string> = {};
      const result = findFilesInNode(paths, windowsMockTree);
      expect(result).toEqual(expected);
    });

    it('should ignore directories even if nested', () => {
      const paths = ['src/components/subComponents'];
      const expected: Record<string, string> = {};
      const result = findFilesInNode(paths, unixMockTree);
      expect(result).toEqual(expected);
    });
  });

  // Test Case 6: Empty paths array
  describe('Empty paths array', () => {
    it('should return an empty object when paths array is empty', () => {
      const paths: string[] = [];
      const expected: Record<string, string> = {};
      const result = findFilesInNode(paths, windowsMockTree);
      expect(result).toEqual(expected);
    });
  });

  // Test Case 7: Root path handling
  describe('Root path handling', () => {
    it('should find a file directly under the root directory', () => {
      const rootMockTree: ContentNode = createDirectory('C:\\Projects\\MyApp', {
        'rootFile.txt': createFile('C:\\Projects\\MyApp\\rootFile.txt', 'Root File Content'),
      });
      const paths = ['rootFile.txt'];
      const expected = {
        'rootFile.txt': 'Root File Content',
      };
      const result = findFilesInNode(paths, rootMockTree);
      expect(result).toEqual(expected);
    });

    it('should find multiple files directly under the root directory', () => {
      const rootMockTree: ContentNode = createDirectory('C:\\Projects\\MyApp', {
        'rootFile1.txt': createFile('C:\\Projects\\MyApp\\rootFile1.txt', 'Root File 1 Content'),
        'rootFile2.txt': createFile('C:\\Projects\\MyApp\\rootFile2.txt', 'Root File 2 Content'),
      });
      const paths = ['rootFile1.txt', 'rootFile2.txt'];
      const expected = {
        'rootFile1.txt': 'Root File 1 Content',
        'rootFile2.txt': 'Root File 2 Content',
      };
      const result = findFilesInNode(paths, rootMockTree);
      expect(result).toEqual(expected);
    });
  });
});
