// src/main/inspector.ts

import { createSkyInspector } from '@statelyai/inspect';

// @ts-ignore - TODO We need to fix entire inspector
export const inspector = createSkyInspector({
  onerror: (error) => {
    console.error("Inspector Error:", error);
  },
});

// Start the inspector
inspector.start?.();
