// src/main/smartTasks/smartUnitTestMaker/flows/mockDependencyFlow.ts

import { findOrCreateMock } from '../utils/mockUtils';
import { MockDefinition } from '../types/flows';
import * as path from 'path';

interface DependencyNode {
  modulePath: string;
  dependencies: Set<string>;
  content?: string;
}

/**
 * Sorts mocks in dependency order
 */
function sortMocksByDependency(nodes: Map<string, DependencyNode>): string[] {
  const visited = new Set<string>();
  const sorted: string[] = [];

  function visit(modulePath: string, ancestors = new Set<string>()) {
    if (ancestors.has(modulePath)) {
      throw new Error(`Circular dependency detected: ${Array.from(ancestors).join(' -> ')} -> ${modulePath}`);
    }

    if (visited.has(modulePath)) return;

    ancestors.add(modulePath);
    const node = nodes.get(modulePath);
    if (node) {
      for (const dep of node.dependencies) {
        visit(dep, new Set(ancestors));
      }
    }
    ancestors.delete(modulePath);
    visited.add(modulePath);
    sorted.push(modulePath);
  }

  for (const modulePath of nodes.keys()) {
    if (!visited.has(modulePath)) {
      visit(modulePath);
    }
  }

  return sorted;
}

/**
 * Manages the creation and validation of interdependent mocks
 */
export async function processMockDependencies(
  sessionId: string,
  projectPath: string,
  requiredMocks: { modulePath: string; content?: string }[]
): Promise<MockDefinition[]> {
  // Build dependency graph
  const nodes = new Map<string, DependencyNode>();
  
  // First pass: create nodes
  for (const mock of requiredMocks) {
    nodes.set(mock.modulePath, {
      modulePath: mock.modulePath,
      dependencies: new Set(),
      content: mock.content
    });
  }

  // Second pass: analyze dependencies
  for (const [modulePath, node] of nodes.entries()) {
    if (node.content) {
      // Extract imports from content
      const importRegex = /import.*?['"](.+?)['"]/g;
      let match;
      while ((match = importRegex.exec(node.content)) !== null) {
        const importPath = match[1];
        if (nodes.has(importPath)) {
          node.dependencies.add(importPath);
        }
      }
    }
  }

  // Sort mocks by dependency order
  const sortedPaths = sortMocksByDependency(nodes);

  // Create mocks in correct order
  const generatedMocks: MockDefinition[] = [];
  for (const modulePath of sortedPaths) {
    const node = nodes.get(modulePath)!;
    const mock = await findOrCreateMock(
      sessionId,
      projectPath,
      modulePath,
      node.content,
      {
        dependencies: Array.from(node.dependencies)
      }
    );
    generatedMocks.push(mock);
  }

  return generatedMocks;
}