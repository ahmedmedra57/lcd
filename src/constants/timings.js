/**
 * Timing Constants
 * Centralized timing values for timeouts, intervals, and delays
 */

// Time Units (in milliseconds)
export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
};

// Application Timeouts
export const TIMEOUTS = {
  // Auto-reload application every 12 hours
  APP_AUTO_RELOAD: 12 * TIME_UNITS.HOUR,

  // Message display durations
  SUCCESS_MESSAGE: 3 * TIME_UNITS.SECOND,
  ERROR_MESSAGE: 5 * TIME_UNITS.SECOND,
  INFO_MESSAGE: 4 * TIME_UNITS.SECOND,

  // User interaction timeouts
  IDLE_TIMEOUT: 15 * TIME_UNITS.MINUTE,
  SESSION_TIMEOUT: 30 * TIME_UNITS.MINUTE,

  // Debounce delays
  INPUT_DEBOUNCE: 300,
  SEARCH_DEBOUNCE: 500,
  RESIZE_DEBOUNCE: 250,

  // Loading states
  MIN_LOADING_TIME: 500,
  MAX_LOADING_TIME: 10 * TIME_UNITS.SECOND,
};

// Polling Intervals
export const INTERVALS = {
  // Data polling
  SENSOR_POLL: 5 * TIME_UNITS.SECOND,
  STATUS_POLL: 10 * TIME_UNITS.SECOND,
  WEATHER_POLL: 30 * TIME_UNITS.MINUTE,

  // Auto-save intervals
  AUTO_SAVE: 2 * TIME_UNITS.MINUTE,
};

// Animation Durations (in milliseconds or CSS values)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 800,

  // CSS transition values
  FAST_CSS: '0.15s',
  NORMAL_CSS: '0.3s',
  SLOW_CSS: '0.5s',
};

// Transition Delays
export const TRANSITION_DELAY = {
  NONE: 0,
  SHORT: 100,
  MEDIUM: 200,
  LONG: 300,
};
