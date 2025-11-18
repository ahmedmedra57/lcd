import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isEsSwitchActivated: false,
  displayConflictMessage: false,

  instantHeat: { inputTemp: 0, isActivated: false, isF: null },
  snowSensor: { isReady: false, isActivated: false, defaultTemp: 350 },

  optionalConstantTemp: {
    inputTemp: 0,
    isActivated: false,
    isF: null,
  },

  heatingScheduleCalendar: { isDisplayed: false, id: null },
  heatingScheduleList: [
    {
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: null,
      id: null,
    },
  ],
  heatingSchedule: {
    isReady: false,
    isActivated: false,
    disable: false,
  },

  windFactor: { isReady: false, isActivated: false },
  isExpanded: false,
  currentTemp: null,
  energyConsumption: null,
  outSideTemp: null,
  hoursOfUsage: null,
  select: [
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
};

const essSwitchSlice = createSlice({
  name: 'essSwitch',
  initialState,
  reducers: {
    expand: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    instantHeat: (state, action) => {
      console.log(action.payload);
      state.instantHeat.inputTemp = action.payload.temp;
      state.instantHeat.isF = action.payload.unitsMeasurement;
      state.instantHeat.isActivated = !state.instantHeat.isActivated;
    },
    snowSensor: (state) => {
      state.snowSensor.isReady = !state.snowSensor.isReady;
    },

    addHeatingSchedule: (state, action) => {
      // add a schedule (start, end, index, temp, isF)
      state.heatingScheduleList[action.payload.index] = {
        start: action.payload.start,
        end: action.payload.end,
        inputTemp: action.payload.inputTemp,
        id: action.payload.id,
      };
    },
    heatingScheduleBeReady: (state, action) => {
      state.heatingSchedule.isReady = action.payload;
    },

    heatingScheduleClear: (state, action) => {
      if (state.heatingScheduleList.length === 1) {
        // Initialize the first index
        state.heatingScheduleList = [
          {
            start: { date: null, time: null },
            end: { date: null, time: null },
            inputTemp: null,
            isF: null,
          },
        ];
      } else {
        // delete a schedule depending on the index
        const copyArr = state.heatingScheduleList.filter(
          (schedule, index) => index !== action.payload && schedule
        );
        state.heatingScheduleList = [...copyArr];
      }
    },

    heatingScheduleOpen: (state, action) => {
      state.heatingScheduleCalendar.isDisplayed = true;
      state.heatingScheduleCalendar.id = action.payload;
    },
    heatingScheduleCancel: (state) => {
      state.heatingScheduleCalendar.isDisplayed = false;
    },
    windFactor: (state) => {
      state.windFactor.isReady = !state.windFactor.isReady;
    },
    constantTemp: (state, action) => {
      state.optionalConstantTemp.isActivated =
        !state.optionalConstantTemp.isActivated;
      state.optionalConstantTemp.inputTemp = action.payload.temp;
      state.optionalConstantTemp.isF = action.payload.unitsMeasurement;
    },
    activateEsSwitchStatus: (state) => {
      state.isEsSwitchActivated = true;
    },
    deactivateEsSwitchStatus: (state) => {
      state.isEsSwitchActivated = false;
      state.instantHeat = initialState.instantHeat;
      state.fanOnly = false;
      state.snowSensor = initialState.snowSensor;
      state.optionalConstantTemp = initialState.optionalConstantTemp;
      state.heatingSchedule = initialState.heatingSchedule;
      state.windFactor = initialState.windFactor;
    },
    activateEsConflictMessage: (state) => {
      state.displayConflictMessage = true;
    },
    deactivateEsConflictMessage: (state) => {
      state.displayConflictMessage = false;
    },
    handleSnowSensorDefaultTemp: (state, action) => {
      state.snowSensor.defaultTemp = action.payload;
    },
    handleTurnOffTheHeater: (state) => {
      state.isEsSwitchActivated = false;
      state.heatingScheduleCalendar = { isDisplayed: false, id: null };
      state.instantHeat = { instantHeatTemp: 0, instantButtonToggler: false };
      state.snowSensor = { isReady: false, activated: false, defaultTemp: 350 };
      state.optionalConstantTemp = { inputTemp: 0, apply: false };
      state.heatingSchedule = {
        inputTemp: 0,
        isReady: false,
        activated: false,
        disable: false,
      };

      state.windFactor = { isReady: false, activated: false };
    },
  },
});

export default essSwitchSlice;
export const selectEssSwitch = (state) => state.essSwitch;
export const {
  expand,
  instantHeat,
  snowSensor,
  addHeatingSchedule,
  heatingSchedule,
  heatingScheduleCancel,
  heatingScheduleBeReady,
  heatingScheduleOpen,
  heatingScheduleClear,
  windFactor,
  constantTemp,
  activateEsSwitchStatus,
  deactivateEsSwitchStatus,
  activateEsConflictMessage,
  deactivateEsConflictMessage,

  handleSnowSensorDefaultTemp,
  handleTurnOffTheHeater,
} = essSwitchSlice.actions;
