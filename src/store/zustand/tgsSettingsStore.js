import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TEMP_UNIT } from '../../constants/storeConstants';

/**
 * TGS/TES Settings Store
 * Consolidates: settingsOfTgsSlice, settingsOfTgsTesSlice
 * Manages settings specific to TGS and TES heating systems
 */
const useTgsSettingsStore = create(
  devtools(
    (set) => ({
      // === UNITS MEASUREMENT ===
      unitsMeasurement: TEMP_UNIT.FAHRENHEIT,

      // === WIND FACTOR SETTINGS ===
      windFactorTemp: {
        low: null,
        med: null,
        high: null,
        extreme: null,
        unit: TEMP_UNIT.FAHRENHEIT,
      },

      // === SNOW SENSOR TEMPERATURE ===
      snowSensorTemp: {
        tgs: null,
        tes: null,
        unit: TEMP_UNIT.FAHRENHEIT,
      },

      // === TELEMETRY SELECTION ===
      selectTelemetry: {
        tgsHeaterTemp: null,
        tesHeaterTemp: null,
        encloseTemp: null,
        outsideTemp: null,
        burningChamberTemp: null,
      },

      // === TELEMETRY DATA ===
      telemetry: {
        outsideTemp: { select: 'tc-01' },
        burningChamberTemp: { select: 'tc-01' },
        tgsHeaterTemp: { select: 'tc-01' },
        tesHeaterTemp: { select: 'tc-01' },
        encloseTemp: { select: 'tc-01' },
      },

      // === VALVE INPUTS ===
      valveInputs: {
        start: null,
        min: null,
        max: null,
      },

      // === GAS TYPE ===
      gasType: null,

      // === THERMOCOUPLE ===
      thermocouple: null,

      // === ATS SELECTION ===
      ats: {
        tgs: null,
        tes: null,
        sys: null,
      },

      // === ACTIONS ===

      // Units Measurement
      setUnitsMeasurement: (unit) => set({ unitsMeasurement: unit }),
      toggleUnitsMeasurement: () =>
        set((state) => ({
          unitsMeasurement:
            state.unitsMeasurement === TEMP_UNIT.FAHRENHEIT
              ? TEMP_UNIT.CELSIUS
              : TEMP_UNIT.FAHRENHEIT,
        })),

      // Wind Factor
      applyWindFactorSettings: (low, med, high, extreme, unit) =>
        set({
          windFactorTemp: { low, med, high, extreme, unit },
        }),

      setWindFactorFromSocket: (data) => {
        // Handle socket format: { windFactor: { lowWind, medWind, highWind, extremeWind } }
        if (data?.windFactor) {
          set({
            windFactorTemp: {
              low: data.windFactor.lowWind,
              med: data.windFactor.medWind,
              high: data.windFactor.highWind,
              extreme: data.windFactor.extremeWind,
              unit: TEMP_UNIT.FAHRENHEIT, // Default unit from socket
            },
          });
        }
      },

      // Snow Sensor
      applySnowSensorSettings: (tgsTemp, tesTemp, unit) =>
        set({
          snowSensorTemp: { tgs: tgsTemp, tes: tesTemp, unit },
        }),

      // Telemetry Selection
      applyForceAndCommandSettings: (selections) =>
        set({
          selectTelemetry: {
            tgsHeaterTemp: selections.tgsHeaterTemp,
            tesHeaterTemp: selections.tesHeaterTemp,
            encloseTemp: selections.encloseTemp,
            outsideTemp: selections.outsideTemp,
            burningChamberTemp: selections.burningChamberTemp,
          },
        }),

      setTelemetrySelection: (field, value) =>
        set((state) => ({
          selectTelemetry: {
            ...state.selectTelemetry,
            [field]: value,
          },
        })),

      // Telemetry Data
      setTelemetry: (telemetryData) =>
        set({
          telemetry: {
            outsideTemp: telemetryData.outsideTemp || { select: 'tc-01' },
            burningChamberTemp: telemetryData.burningChamberTemp || { select: 'tc-01' },
            tgsHeaterTemp: telemetryData.tgsHeaterTemp || { select: 'tc-01' },
            tesHeaterTemp: telemetryData.tesHeaterTemp || { select: 'tc-01' },
            encloseTemp: telemetryData.encloseTemp || { select: 'tc-01' },
          },
        }),

      setTelemetryField: (field, tcSelect) =>
        set((state) => ({
          telemetry: {
            ...state.telemetry,
            [field]: { select: tcSelect },
          },
        })),

      // Valve Settings
      setValveInputs: (valveData) => {
        // Support both object and individual parameters for compatibility
        if (typeof valveData === 'object' && valveData !== null) {
          // Handle { first, second, third } format from socket
          if ('first' in valveData || 'second' in valveData || 'third' in valveData) {
            set({
              valveInputs: {
                start: valveData.first ?? null,
                min: valveData.second ?? null,
                max: valveData.third ?? null,
              },
            });
          } else {
            // Handle { start, min, max } format
            set({
              valveInputs: {
                start: valveData.start ?? null,
                min: valveData.min ?? null,
                max: valveData.max ?? null,
              },
            });
          }
        }
      },

      // Gas Type
      setGasType: (gasType) => set({ gasType }),

      // Thermocouple
      setThermocouple: (tc) => set({ thermocouple: tc }),

      // ATS Selection
      setTgsAts: (ats) =>
        set((state) => ({
          ats: { ...state.ats, tgs: ats },
        })),

      setTesAts: (ats) =>
        set((state) => ({
          ats: { ...state.ats, tes: ats },
        })),

      setSysAts: (ats) =>
        set((state) => ({
          ats: { ...state.ats, sys: ats },
        })),

      setAllAts: (tgs, tes, sys) =>
        set({ ats: { tgs, tes, sys } }),

      // Reset
      resetTgsSettings: () =>
        set({
          windFactorTemp: {
            low: null,
            med: null,
            high: null,
            extreme: null,
            unit: TEMP_UNIT.FAHRENHEIT,
          },
          snowSensorTemp: {
            tgs: null,
            tes: null,
            unit: TEMP_UNIT.FAHRENHEIT,
          },
          selectTelemetry: {
            tgsHeaterTemp: null,
            tesHeaterTemp: null,
            encloseTemp: null,
            outsideTemp: null,
            burningChamberTemp: null,
          },
          valveInputs: {
            start: null,
            min: null,
            max: null,
          },
          gasType: null,
          thermocouple: null,
        }),
    }),
    { name: 'TgsSettingsStore' }
  )
);

export default useTgsSettingsStore;
