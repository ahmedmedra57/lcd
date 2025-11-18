import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FEATURE_STATE, TEMP_UNIT } from '../../constants/storeConstants';

/**
 * TGS Switch Store
 *
 * Similar improvements to ESS store:
 * - Single state property instead of multiple booleans
 * - Cleaner API and easier state transitions
 */
const useTgsSwitchStore = create(
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

      // === FAN ONLY MODE ===
      fanOnly: {
        isActivated: false,
      },

      // === SNOW SENSOR (Optimized: single state) ===
      snowSensor: {
        state: FEATURE_STATE.DISABLED,
        defaultTemp: 350,
        unit: TEMP_UNIT.FAHRENHEIT,
      },

      // === HEATING SCHEDULE (Optimized: single state) ===
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

      // === WIND FACTOR (Optimized: single state) ===
      windFactor: {
        state: FEATURE_STATE.DISABLED,
      },

      // === DISPLAY & TELEMETRY ===
      isExpanded: false,
      currentTemp: null,
      energyConsumption: null,
      outsideTemp: null,
      hoursOfUsage: null,

      // === THERMOCOUPLE OPTIONS ===
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
          fanOnly: { isActivated: false },
          snowSensor: {
            state: FEATURE_STATE.DISABLED,
            defaultTemp: 350,
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

      // Fan Only
      toggleFanOnly: () =>
        set((state) => ({
          fanOnly: { isActivated: !state.fanOnly.isActivated },
        })),

      setFanOnly: (isActivated) =>
        set({
          fanOnly: { isActivated },
        }),

      // Snow Sensor
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

      // Wind Factor
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

      // Heating Schedule
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
          fanOnly: { isActivated: false },
          snowSensor: {
            state: FEATURE_STATE.DISABLED,
            defaultTemp: 350,
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
    { name: 'TgsSwitchStore' }
  )
);

export default useTgsSwitchStore;
