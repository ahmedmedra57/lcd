import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  SETTINGS_OPTIONS,
  BUTTON_STATE,
  INTERFACE_MODE,
  TEMP_UNIT,
} from '../../constants/storeConstants';

/**
 * Settings Store
 * Consolidates: settingsOfEssSlice, unitsSlice, themeSlice
 *
 * IMPROVEMENTS:
 * - Replaced 5 booleans (settingsOptionsUnits, settingsOptionsWindFactor, etc.)
 *   with single 'currentOption' string
 * - Replaced 3 button booleans with single 'buttonState' string
 * - Merged theme and units management into single store
 * - More maintainable and less error-prone
 */

const themeColors = {
  light: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    text: '#000000',
    border: '#e0e0e0',
    background: '#ffffff',
  },
  dark: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    text: '#ffffff',
    border: '#404040',
    background: '#121212',
  },
};
const useSettingsStore = create(
  devtools(
    persist(
      (set, get) => ({
        // === THEME (from themeSlice) ===
        themeMode: 'light',
        themeColors: themeColors.light,

        // === INTERFACE ===
        interfaceMode: INTERFACE_MODE.BASIC,

        // === SETTINGS OPTIONS (BEFORE: 5 booleans, NOW: 1 string) ===
        currentOption: SETTINGS_OPTIONS.UNITS,

        // === BUTTON STATE (BEFORE: 3 booleans, NOW: 1 string) ===
        buttonState: BUTTON_STATE.IDLE,

        // === UNITS MEASUREMENT ===
        unitsMeasurement: TEMP_UNIT.FAHRENHEIT,

        // === TELEMETRY SELECTION ===
        selectTelemetry: {
          essHeaterTemp: null,
          essEncloseTemp: null,
          essOutsideTemp: null,
        },

        // === SNOW SENSOR TEMP ===
        snowSensorTemp: {
          essTemp: null,
          isFahrenheit: null,
        },

        // === ATS STATE ===
        selectedAts: null,

        // === TELEMETRY DATA ===
        telemetry: {
          essHeaterTemp: { select: 'tc-01' },
          essEncloseTemp: { select: 'tc-01' },
          essOutsideTemp: null,
        },

        // ===== ACTIONS =====

        // Theme (from themeSlice)
        toggleTheme: () =>
          set((state) => {
            const newMode = state.themeMode === 'light' ? 'dark' : 'light';
            return {
              themeMode: newMode,
              themeColors: themeColors[newMode],
            };
          }),

        setTheme: (mode) =>
          set({
            themeMode: mode,
            themeColors: themeColors[mode],
          }),

        // Interface Mode
        setInterfaceMode: (mode) => set({ interfaceMode: mode }),
        toggleInterfaceMode: () =>
          set((state) => ({
            interfaceMode:
              state.interfaceMode === INTERFACE_MODE.BASIC
                ? INTERFACE_MODE.ADVANCED
                : INTERFACE_MODE.BASIC,
          })),

        // Settings Options (BEFORE: 5 separate actions, NOW: 1 action)
        setCurrentOption: (option) => set({ currentOption: option }),

        // Button State (BEFORE: 3+ separate actions, NOW: 1 action)
        setButtonState: (state) => set({ buttonState: state }),

        // Convenience methods for button states
        setEditMode: () =>
          set({
            buttonState: BUTTON_STATE.EDIT,
          }),

        setCancelMode: () =>
          set({
            buttonState: BUTTON_STATE.CANCEL,
          }),

        setApplyMode: () =>
          set({
            buttonState: BUTTON_STATE.APPLY,
          }),

        resetButtons: () =>
          set({
            buttonState: BUTTON_STATE.IDLE,
          }),

        // Units Measurement
        setUnitsMeasurement: (unit) => set({ unitsMeasurement: unit }),
        toggleUnitsMeasurement: () =>
          set((state) => ({
            unitsMeasurement:
              state.unitsMeasurement === TEMP_UNIT.FAHRENHEIT
                ? TEMP_UNIT.CELSIUS
                : TEMP_UNIT.FAHRENHEIT,
          })),

        // Apply Settings Actions
        applySnowSensorSettings: (essTemp, isFahrenheit) =>
          set({
            buttonState: BUTTON_STATE.APPLY,
            snowSensorTemp: { essTemp, isFahrenheit },
          }),

        applyForceCommandSettings: (essHeaterTemp, essEncloseTemp, essOutsideTemp) =>
          set({
            buttonState: BUTTON_STATE.IDLE,
            selectTelemetry: {
              essHeaterTemp,
              essEncloseTemp,
              essOutsideTemp,
            },
          }),

        // ATS Selection
        setSelectedAts: (ats) => set({ selectedAts: ats }),

        // Telemetry
        setTelemetry: (essHeater, essEnclose, essOutside) =>
          set({
            telemetry: {
              essHeaterTemp: essHeater,
              essEncloseTemp: essEnclose,
              essOutsideTemp: essOutside,
            },
          }),

        // Reset entire store
        resetSettings: () =>
          set({
            currentOption: SETTINGS_OPTIONS.UNITS,
            buttonState: BUTTON_STATE.IDLE,
            selectedAts: null,
          }),
      }),
      {
        name: 'settings-storage',
        partialize: (state) => ({
          themeMode: state.themeMode,
          interfaceMode: state.interfaceMode,
          unitsMeasurement: state.unitsMeasurement,
          currentOption: state.currentOption,
        }),
      }
    ),
    { name: 'SettingsStore' }
  )
);

export default useSettingsStore;
