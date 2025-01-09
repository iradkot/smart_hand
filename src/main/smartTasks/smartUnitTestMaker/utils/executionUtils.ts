// utils/executionUtils.ts

import { exec } from 'child_process'
import { TestResult } from '../types'
import { promises as fs } from 'fs'
import * as path from 'path'
import stripAnsi from 'strip-ansi'

export const executeTest = (
  packageManager: string,
  projectPath: string,
  testFilePath: string,
): Promise<TestResult> => {
  return new Promise((resolve) => {
    const command = buildTestCommand(packageManager, testFilePath)
    exec(command, { cwd: projectPath }, async (error, _stdout, stderr) => {
      if (error) {
        // Read jest-results.json
        const resultsPath = path.join(projectPath, 'jest-results.json')
        try {
          const resultsContent = await fs.readFile(resultsPath, 'utf-8')
          const results = JSON.parse(resultsContent)

          // Process the errors
          const formattedErrors = getFormattedErrors(results, projectPath)
          const errorMessage = prepareErrorForPrompt(formattedErrors)

          resolve({
            success: false,
            errorMessage: errorMessage,
            details: results,
          })
        } catch (readError) {
          // If we can't read jest-results.json, process stderr
          const cleanedStderr = stripAnsi(stderr)
          const errorMessage = parseStderr(cleanedStderr)

          resolve({
            success: false,
            errorMessage: errorMessage,
          })
        }
      } else {
        resolve({ success: true })
      }
    })
  })
}

const buildTestCommand = (packageManager: string, testFilePath: string): string => {
  const testCommand = packageManager === 'yarn' ? 'yarn test' : 'npm test'
  return `${testCommand} -- ${testFilePath} --json --outputFile=jest-results.json`
}

function getFormattedErrors(jestResults: any, projectPath: string): FormattedError[] {
  // noinspection UnnecessaryLocalVariableJS
  const failures = jestResults.testResults
    .filter((testResult: any) => testResult.status === 'failed')
    .map((testResult: any) => ({
      filePath: simplifyFilePath(testResult.name, projectPath),
      assertionResults: testResult.assertionResults
        .filter((assertion: any) => assertion.status === 'failed')
        .map((assertion: any) => ({
          title: assertion.title,
          fullName: assertion.fullName,
          failureMessages: assertion.failureMessages.map((msg: string) => stripAnsi(msg)),
        })),
    }))

  return failures
}

function simplifyFilePath(filePath: string, projectPath: string): string {
  return path.relative(projectPath, filePath)
}

function prepareErrorForPrompt(formattedErrors: FormattedError[]): string {
  return formattedErrors
    .map((error) => {
      const { filePath, assertionResults } = error
      const errorDetails = assertionResults
        .map((assertion) => {
          return `Test: ${assertion.fullName}\nMessages:\n${assertion.failureMessages.join('\n')}`
        })
        .join('\n\n')

      return `File: ${filePath}\n${errorDetails}`
    })
    .join('\n\n')
}

function parseStderr(stderr: string): string {
  // Basic parsing; can be improved
  return stderr
}

interface FormattedError {
  filePath: string;
  assertionResults: {
    title: string;
    fullName: string;
    failureMessages: string[];
  }[];
}
