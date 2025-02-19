# Smart Unit Test Maker

An intelligent test generation system that uses a state machine approach to create, execute, and fix unit tests automatically.

## Overview

The Smart Unit Test Maker provides seamless integration between local operations and AI assistance, working together throughout the test creation process. Each phase can involve both local processing and AI assistance as needed, ensuring the most effective test generation and maintenance.

## Integrated Flow States

The test generation flows through these states, with each state potentially involving both local and AI operations:

- `analyzingFile`: 
  - Local: Scans file system, reads source files, checks existing mocks
  - AI: Assists in understanding complex imports and relationships

- `classifyingFile`: 
  - Local: Provides file analysis results and context
  - AI: Determines code type and mocking needs
  - Local: Organizes the classification results

- `generatingTest`: 
  - Local: Sets up test file structure and mock directories
  - AI: Generates test content and mock implementations
  - Local: Writes files and validates structure

- `executingTest`: 
  - Local: Configures test environment
  - Local: Runs tests with proper mock integration
  - Local: Captures detailed results

- `checkingIfFailed`: 
  - Local: Analyzes test execution results
  - AI: Helps interpret complex failures
  - Local: Determines next steps

- `handlingFailure`: 
  - Local: Gathers failure context
  - AI: Analyzes failures and suggests fixes
  - Local: Applies fixes and prepares for retry

## Usage

```typescript
await smartUnitTestMaker({
  sessionId: string,
  directoryPath: string,
  fileName: string,
  fileContent: string,
  packageManager: string,
  maxRetries?: number // defaults to 2
});
```

## Process Integration

1. **File Analysis & Mock Management**
   - Local scan of file system
   - AI-assisted import analysis
   - Local mock discovery
   - AI mock content generation
   - Local mock dependency resolution
   - Integrated mock validation

2. **Test Generation & Execution**
   - Local test file setup
   - AI test strategy development
   - Local dependency management
   - AI test case generation
   - Local file writes and validation
   - Integrated error handling

3. **Error Resolution Process**
   - Local error capture
   - AI error analysis
   - Local fix application
   - AI validation suggestions
   - Integrated retry logic

## Architecture

The system uses a tightly integrated architecture where components work together seamlessly:

### Core Components
- XState state machine for orchestration
- Jest for test execution
- AI assistance for complex operations
- File system operations
- Mock management system

### Integrated Features
- Dependency analysis and resolution
- Mock generation and management
- Test strategy development
- Error handling and recovery
- Continuous validation

## Mock Management

Mock handling is deeply integrated throughout the process:

1. **Discovery Phase**
   - Local scanning for existing mocks
   - AI analysis of mock requirements
   - Local dependency tracking
   - AI-assisted mock generation

2. **Management Phase**
   - Local mock file organization
   - AI mock content creation
   - Local dependency resolution
   - Integrated validation

3. **Usage Phase**
   - Local mock loading
   - AI-assisted integration
   - Local validation
   - Continuous monitoring

The system maintains flexibility to seamlessly transition between local operations and AI assistance as needed, ensuring the most effective approach for each specific situation.