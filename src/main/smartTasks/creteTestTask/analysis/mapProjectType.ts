// createTestTask/analysis/mapProjectType.ts

export function mapProjectType(
  apiProjectType: string
): 'web' | 'react-native' | 'electron' | 'node-server' | 'unknown' {
  switch (apiProjectType) {
    case 'react-web':
      return 'web';
    case 'react-native':
    case 'electron':
    case 'node-server':
      return apiProjectType as 'react-native' | 'electron' | 'node-server';
    default:
      return 'unknown';
  }
}
