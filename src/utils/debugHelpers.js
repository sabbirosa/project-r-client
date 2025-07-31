/**
 * Debug helpers for troubleshooting authentication issues
 * Set DEBUG_AUTH to false in production to disable auth logging
 */

const DEBUG_AUTH = true; // Set to false to disable debugging

export const debugLog = (context, data) => {
  if (DEBUG_AUTH) {
    console.log(`[DEBUG] ${context}:`, data);
  }
};

export const debugError = (context, error) => {
  if (DEBUG_AUTH) {
    console.error(`[DEBUG] ${context}:`, error);
  }
};

export const debugWarn = (context, message) => {
  if (DEBUG_AUTH) {
    console.warn(`[DEBUG] ${context}:`, message);
  }
};

export const setDebugMode = (enabled) => {
  // This would require more sophisticated state management to work properly
  // For now, manually change DEBUG_AUTH above
  console.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}. Restart app to apply.`);
};