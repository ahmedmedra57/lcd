/**
 * Zustand Store Index
 * Export all stores for easy importing
 *
 * All Redux slices have been migrated to Zustand stores
 */

// === SWITCH STORES ===
export { default as useEssSwitchStore } from './essSwitchStore';
export { default as useTgsSwitchStore } from './tgsSwitchStore';

// === SETTINGS STORES ===
export { default as useSettingsStore } from './settingsStore';
export { default as useTgsSettingsStore } from './tgsSettingsStore';
export { default as useAdminSettingsStore } from './adminSettingsStore';
export { default as useSystemIdentificationStore } from './systemIdentificationStore';

// === HEATER & SSR STORES ===
export { default as useHeaterStatusStore } from './heaterStatusStore';

// === FAULT MANAGEMENT ===
export { default as useFaultsStore } from './faultsStore';

// === TELEMETRY & CONTROL ===
export { default as useForceAndCommandStore } from './forceAndCommandStore';
export { default as useChartStore } from './chartStore';

// === UTILITY STORES ===
export { default as useUserStore } from './userStore';
export { default as useTimerStore } from './timerStore';

// === CONSTANTS ===
export * from '../../constants/storeConstants';
