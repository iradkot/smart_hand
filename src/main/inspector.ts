// src/main/inspector.ts

import { createSkyInspector } from '@statelyai/inspect';

export const inspector = createSkyInspector({
  devMode: true, // Enable development mode
  onerror: (error) => {
    console.error("Inspector Error:", error);
  },
});

// Start the inspector
inspector.start?.();
