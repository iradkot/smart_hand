import glob from 'glob'
import { FileHandler } from '../fileOperations/utils/FileHandler'
import cleanContent from '../utils/minimizeAndCleanStrings'

export async function findTypeDefinitionsForDependencySync(
  libraries: any,
  minimal: boolean = false,
): Promise<{ fileName: string, content: string }[]> {
  if (!libraries) {
    console.log('No libraries found.')
    return []
  }

  const foundFiles: { fileName: string, content: string }[] = []
  const fileHandler = new FileHandler()

  // Loop through each library and use glob.sync to find TypeScript definitions
  for (const lib of libraries) {
    const { name } = lib
    console.log(`Finding types for ${name}...`)

    const files = glob.sync(`node_modules/${name}/**/*.d.ts`)

    if (files.length === 0) {
      console.log(`No type definitions found for ${name}.`)
    } else {
      // If minimal is true, filter only files that end with 'index.d.ts'
      const filteredFiles = minimal ? files.filter(file => file.endsWith('index.d.ts')) : files

      for (const file of filteredFiles) {
        try {
          const content = await fileHandler.readFile(file) // Read the content using FileHandler
          const cleanedContent = cleanContent(content) // Clean the content
          if (cleanedContent.length > 0) {
            foundFiles.push({ fileName: file, content: cleanedContent })
          }
        } catch (error) {
          console.error(`Failed to read file: ${file}`, error)
        }
      }
    }
  }

  return foundFiles // Return the array of objects containing file names and cleaned contents
}
