/**
 * Temperature Constants
 * Min/Max temperature values for validation and display
 */

// Temperature Limits (Celsius)
export const TEMPERATURE_CELSIUS = {
  MIN: 121,
  MAX: 999,
  DEFAULT: 150,
};

// Temperature Limits (Fahrenheit)
export const TEMPERATURE_FAHRENHEIT = {
  MIN: 250,
  MAX: 1830,
  DEFAULT: 302,
};

// Temperature Conversion Formulas
export const TEMPERATURE_CONVERSION = {
  celsiusToFahrenheit: (celsius) => (celsius * 9) / 5 + 32,
  fahrenheitToCelsius: (fahrenheit) => ((fahrenheit - 32) * 5) / 9,
};

// Temperature Units
export const TEMPERATURE_UNITS = {
  CELSIUS: '°C',
  FAHRENHEIT: '°F',
};

// Temperature Validation Messages
export const TEMPERATURE_MESSAGES = {
  MIN_CELSIUS: `The minimum temperature is ${TEMPERATURE_CELSIUS.MIN}°C - ${TEMPERATURE_FAHRENHEIT.MIN}°F`,
  MAX_CELSIUS: `The maximum temperature is ${TEMPERATURE_CELSIUS.MAX}°C - ${TEMPERATURE_FAHRENHEIT.MAX}°F`,
  INPUT_REQUIRED: 'Please input your temperature',
  FINALIZE_SCHEDULE: 'In order to finalize your heating schedule, please input your temperature',
};
