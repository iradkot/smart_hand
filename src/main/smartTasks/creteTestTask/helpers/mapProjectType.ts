// src/main/smartTasks/createTestTask/helpers/mapProjectType.ts

// Helper function to map projectType from API response to expected value
export function mapProjectType(
  apiProjectType: 'react-web' | 'react-native' | 'electron' | 'node-server' | 'unknown'
): 'web' | 'react-native' | 'electron' | 'node-server' | 'unknown' {
  switch (apiProjectType) {
    case 'react-web':
      return 'web';
    case 'node-server':
      return 'node-server';
    case 'react-native':
      return 'react-native';
    case 'electron':
      return 'electron';
    default:
      return 'unknown';
  }
}
