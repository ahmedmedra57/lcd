import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FEATURE_STATE, TEMP_UNIT } from '../../constants/storeConstants';

/**
 * ESS Switch Store
 *
 * IMPROVEMENTS:
 * - Replaced { isReady: false, isActivated: false } with single 'state' property
 * - Using FEATURE_STATE enum: 'disabled', 'ready', 'activated'
 * - Much cleaner and easier to reason about
 */
const useEssSwitchStore = create(
  devtools(
    (set, get) => ({
      // === MAIN SWITCH ===
      isActivated: false,
      displayConflictMessage: false,

      // === INSTANT HEAT ===
      instantHeat: {
        inputTemp: 0,
        isActivated: false,
        unit: TEMP_UNIT.FAHRENHEIT,
      },

      // === SNOW SENSOR (BEFORE: isReady + isActivated, NOW: single state) ===
      snowSensor: {
        state: FEATURE_STATE.DISABLED, // 'disabled' | 'ready' | 'activated'
        defaultTemp: 350,
        unit: TEMP_UNIT.FAHRENHEIT,
      },

      // === OPTIONAL CONSTANT TEMP ===
      optionalConstantTemp: {
        inputTemp: 0,
        isActivated: false,
        unit: TEMP_UNIT.FAHRENHEIT,
      },

      // === HEATING SCHEDULE (BEFORE: isReady + isActivated + disable, NOW: single state) ===
      heatingSchedule: {
        state: FEATURE_STATE.DISABLED,
        calendar: {
          isDisplayed: false,
          editingId: null,
        },
        schedules: [
          {
            start: { date: null, time: null },
            end: { date: null, time: null },
            inputTemp: null,
            id: null,
          },
        ],
      },

      // === WIND FACTOR (BEFORE: isReady + isActivated, NOW: single state) ===
      windFactor: {
        state: FEATURE_STATE.DISABLED,
      },

      // === DISPLAY & TELEMETRY ===
      isExpanded: false,
      currentTemp: null,
      energyConsumption: null,
      outsideTemp: null,
      hoursOfUsage: null,

      // === THERMOCOUPLE SELECT OPTIONS ===
      tcOptions: [
        'tc-01',
        'tc-02',
        'tc-03',
        'tc-04',
        'tc-05',
        'tc-06',
        'tc-07',
        'tc-08',
        'tc-09',
        'tc-10',
        'tc-11',
      ],

      // ===== ACTIONS =====

      // Expand/Collapse
      toggleExpand: () => set((state) => ({ isExpanded: !state.isExpanded })),

      // Main Switch
      activateSwitch: () => set({ isActivated: true }),
      deactivateSwitch: () =>
        set({
          isActivated: false,
          instantHeat: { inputTemp: 0, isActivated: false, unit: TEMP_UNIT.FAHRENHEIT },
          snowSensor: {
            state: FEATURE_STATE.DISABLED,
            defaultTemp: 350,
            unit: TEMP_UNIT.FAHRENHEIT,
          },
          optionalConstantTemp: {
            inputTemp: 0,
            isActivated: false,
            unit: TEMP_UNIT.FAHRENHEIT,
          },
          heatingSchedule: {
            ...get().heatingSchedule,
            state: FEATURE_STATE.DISABLED,
          },
          windFactor: { state: FEATURE_STATE.DISABLED },
        }),

      // Conflict Message
      showConflictMessage: () => set({ displayConflictMessage: true }),
      hideConflictMessage: () => set({ displayConflictMessage: false }),

      // Instant Heat
      toggleInstantHeat: (temp, unit) =>
        set((state) => ({
          instantHeat: {
            inputTemp: temp ?? state.instantHeat.inputTemp,
            isActivated: !state.instantHeat.isActivated,
            unit: unit ?? state.instantHeat.unit,
          },
        })),

      setInstantHeat: (temp, unit, isActivated) =>
        set({
          instantHeat: { inputTemp: temp, unit, isActivated },
        }),

      // Snow Sensor (BEFORE: 2 actions for isReady/isActivated, NOW: 1 action)
      setSnowSensorState: (state) =>
        set((prevState) => ({
          snowSensor: { ...prevState.snowSensor, state },
        })),

      toggleSnowSensorReady: () =>
        set((state) => ({
          snowSensor: {
            ...state.snowSensor,
            state:
              state.snowSensor.state === FEATURE_STATE.DISABLED
                ? FEATURE_STATE.READY
                : FEATURE_STATE.DISABLED,
          },
        })),

      setSnowSensorDefaultTemp: (temp) =>
        set((state) => ({
          snowSensor: { ...state.snowSensor, defaultTemp: temp },
        })),

      // Wind Factor (BEFORE: 2 actions, NOW: 1 action)
      setWindFactorState: (state) => set({ windFactor: { state } }),

      toggleWindFactorReady: () =>
        set((state) => ({
          windFactor: {
            state:
              state.windFactor.state === FEATURE_STATE.DISABLED
                ? FEATURE_STATE.READY
                : FEATURE_STATE.DISABLED,
          },
        })),

      // Constant Temp
      toggleConstantTemp: (temp, unit) =>
        set((state) => ({
          optionalConstantTemp: {
            inputTemp: temp ?? state.optionalConstantTemp.inputTemp,
            isActivated: !state.optionalConstantTemp.isActivated,
            unit: unit ?? state.optionalConstantTemp.unit,
          },
        })),

      setConstantTemp: (temp, unit, isActivated) =>
        set({
          optionalConstantTemp: { inputTemp: temp, unit, isActivated },
        }),

      // Heating Schedule (BEFORE: multiple actions, NOW: cleaner API)
      setHeatingScheduleState: (state) =>
        set((prevState) => ({
          heatingSchedule: { ...prevState.heatingSchedule, state },
        })),

      addSchedule: (schedule) =>
        set((state) => {
          const newSchedules = [...state.heatingSchedule.schedules];
          newSchedules[schedule.index] = {
            start: schedule.start,
            end: schedule.end,
            inputTemp: schedule.inputTemp,
            id: schedule.id,
          };
          return {
            heatingSchedule: {
              ...state.heatingSchedule,
              schedules: newSchedules,
            },
          };
        }),

      removeSchedule: (index) =>
        set((state) => {
          if (state.heatingSchedule.schedules.length === 1) {
            return {
              heatingSchedule: {
                ...state.heatingSchedule,
                schedules: [
                  {
                    start: { date: null, time: null },
                    end: { date: null, time: null },
                    inputTemp: null,
                    id: null,
                  },
                ],
              },
            };
          }
          return {
            heatingSchedule: {
              ...state.heatingSchedule,
              schedules: state.heatingSchedule.schedules.filter((_, i) => i !== index),
            },
          };
        }),

      openScheduleCalendar: (id) =>
        set((state) => ({
          heatingSchedule: {
            ...state.heatingSchedule,
            calendar: { isDisplayed: true, editingId: id },
          },
        })),

      closeScheduleCalendar: () =>
        set((state) => ({
          heatingSchedule: {
            ...state.heatingSchedule,
            calendar: { isDisplayed: false, editingId: null },
          },
        })),

      // Telemetry Updates
      updateTelemetry: (updates) => set(updates),

      // Complete Reset
      resetAllFeatures: () =>
        set({
          isActivated: false,
          instantHeat: { inputTemp: 0, isActivated: false, unit: TEMP_UNIT.FAHRENHEIT },
          snowSensor: {
            state: FEATURE_STATE.DISABLED,
            defaultTemp: 350,
            unit: TEMP_UNIT.FAHRENHEIT,
          },
          optionalConstantTemp: {
            inputTemp: 0,
            isActivated: false,
            unit: TEMP_UNIT.FAHRENHEIT,
          },
          heatingSchedule: {
            state: FEATURE_STATE.DISABLED,
            calendar: { isDisplayed: false, editingId: null },
            schedules: [
              {
                start: { date: null, time: null },
                end: { date: null, time: null },
                inputTemp: null,
                id: null,
              },
            ],
          },
          windFactor: { state: FEATURE_STATE.DISABLED },
        }),
    }),
    { name: 'EssSwitchStore' }
  )
);

export default useEssSwitchStore;
