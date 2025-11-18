/**
 * Constants for Zustand stores
 * Using single enum values instead of multiple booleans
 */

// Settings Options - replaces 5 booleans with 1 string value
export const SETTINGS_OPTIONS = {
  UNITS: 'units',
  WIND_FACTOR: 'windFactor',
  SNOW_FACTOR: 'snowFactor',
  FORCE_AND_COMMAND: 'forceAndCommand',
  ADMIN: 'admin',
};

// Button States - replaces 3 booleans with 1 string value
export const BUTTON_STATE = {
  IDLE: 'idle',
  EDIT: 'edit',
  CANCEL: 'cancel',
  APPLY: 'apply',
};

// Feature States - replaces isReady/isActivated booleans
export const FEATURE_STATE = {
  DISABLED: 'disabled',
  READY: 'ready',
  ACTIVATED: 'activated',
};

// Interface Modes
export const INTERFACE_MODE = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
};

// System Types
export const SYSTEM_TYPE = {
  ESS: 'ess',
  TGS: 'tgs',
  TES: 'tes',
  SYS: 'sys',
};

// Temperature Units
export const TEMP_UNIT = {
  FAHRENHEIT: 'F',
  CELSIUS: 'C',
};

// Measurement Systems
export const MEASUREMENT_SYSTEM = {
  IMPERIAL: 'imperial',
  METRIC: 'metric',
};

// ATS Selection States
export const ATS_STATE = {
  NONE: null,
  ESS: 'ess',
  TGS: 'tgs',
  TES: 'tes',
};
