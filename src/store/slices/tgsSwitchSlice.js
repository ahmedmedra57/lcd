import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // isHeaterActivated: false,
  isTgsSwitchActivated: false,
  displayConflictMessage: false,
  displayTgsScheduleModal:false,
  devicesConflicts: {
    systemTarget: "", // device target accpet gas or electrical to force turn on or off to device target
    currentSwitch: "",
    DesiredSwitch: "",
    commandTarget: '',
    extraData: null,
  },

  instantHeat: {
    inputTemp: 0,
    isActivated: false,
    isF: null,
  },
  gasInfo: {},
  electricalInfo: {},
  electricalFaults: [],
  gasFaults: [],
  tesGraphData: null,
  gasGraphData: null,
  outsideGraphData: null,
  enclosureGraphData: null,
  heaterGraphData: null,
  settings: {
    heater_thermocouple_map: [7, 3, 1, 3, 1, 3, 1, 3],
  },
  ssr_setting: [
    {
      Heaters: [
        "TRSC-7L-2S-A48-P1",
        "TRSC-7L-2S-A48-P1",
        "TRSC-7L-2S-A48-P1",
        "TRSC-7L-2S-A48-P1",
      ],
      Load_exceeded: false,
      Load_exceeded_time: 0,
      No: 0,
      active: true,
      fault: true,
      fault_time: 0,
      status: false,
    },
  ],
  fanOnly: false,
  snowSensor: { isReady: false, isActivated: false, defaultTemp: 350 },

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
  currentTemp: null,
  energyConsumption: null,
  outSideTemp: null,
  hoursOfUsage: null,

  optionalConstantTemp: {
    inputTemp: 0,
    isActivated: false,
    isF: null,
  },
  currentRunSystem: null,
  EBP: null,
};

const tgsSwitchSlice = createSlice({
  name: "tgsSwitch",
  initialState,
  reducers: {
    setTgsInfo: (state, action) => {
      state.gasInfo = action.payload;
    },
    setTesInfo: (state, action) => {
      state.electricalInfo = action.payload;
    },
    setTgsFaults: (state, action) => {
      state.gasFaults = action.payload;
    },
    setTesFaults: (state, action) => {
      state.electricalFaults = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
    setSSRSettings: (state, action) => {
      if(action.payload[0]){
      const formatedData = action.payload.map(({ Heaters, ...restProps }) => {
        return {
          Heaters: Heaters.map((heater) => {
            return typeof heater==="string"?heater: heater?.heater;
          }),
          ...restProps,
        };
      });
      state.ssr_setting = formatedData;
    }
    },
    setSSRUpdate: (state, action) => {
      state.ssr_update = action.payload;
    },
    setGasGraphData: (state, action) => {
      state.gasGraphData = action.payload;
    },
    setTesGraphData: (state, action) => {
      state.tesGraphData = action.payload;
    },
    setOutsideGraphData: (state, action) => {
      state.outsideGraphData = action.payload;
    },
    setEnclosureGraphData: (state, action) => {
      state.enclosureGraphData = action.payload;
    },
    setHeaterGraphData: (state, action) => {
      state.heaterGraphData = action.payload;
    },
    tgsInstantHeat: (state, action) => {
      state.instantHeat.inputTemp = action.payload.temp;
      state.instantHeat.isF = action.payload.unitsMeasurement;
      state.instantHeat.isActivated = !state.instantHeat.isActivated;
      state.fanOnly = !state.fanOnly;
    },
    fanOnlyToggler: (state) => {
      state.fanOnly = !state.fanOnly;
    },
    FanOnlyActivator: (state) => {
      state.fanOnly = true;
    },
    tgsSnowSensor: (state) => {
      state.snowSensor.isReady = !state.snowSensor.isReady;
    },

    tgsAddHeatingSchedule: (state, action) => {
      // add a schedule (start, end, index, temp, isF)
      state.heatingScheduleList[action.payload.index] = {
        start: action.payload.start,
        end: action.payload.end,
        inputTemp: action.payload.inputTemp,
        id: action.payload.id,
      };
    },
    tgsHeatingScheduleBeReady: (state, action) => {
      state.heatingSchedule.isReady = action.payload;
    },
    tgsHeatingScheduleClear: (state, action) => {
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

    tgsHeatingScheduleOpen: (state, action) => {
      state.heatingScheduleCalendar.isDisplayed = true;
      state.heatingScheduleCalendar.id = action.payload;
    },
    tgsHeatingScheduleCancel: (state) => {
      state.heatingScheduleCalendar.isDisplayed = false;
    },

    tgsWindFactor: (state) => {
      state.windFactor.isReady = !state.windFactor.isReady;
    },
    activateTgsSwitchStatus: (state) => {
      state.isTgsSwitchActivated = true;
    },
    deactivateTgsSwitchStatus: (state) => {
      state.isTgsSwitchActivated = false;
      state.instantHeat = initialState.instantHeat;
      state.fanOnly = false;
      state.snowSensor = initialState.snowSensor;
      state.optionalConstantTemp = initialState.optionalConstantTemp;
      state.heatingSchedule = initialState.heatingSchedule;
      state.windFactor = initialState.windFactor;
    },
    activateTgsConflictMessage: (state) => {
      state.displayConflictMessage = true;
    },
    activatedisplayTGSScheduleModal: (state) => {
      state.displayTgsScheduleModal = true;
    },
    setDevicesConflicts: (state, action) => {
      state.devicesConflicts = {
        currentSwitch: action.payload.currentSwitch,
        DesiredSwitch: action.payload?.DesiredSwitch,
        systemTarget: action.payload?.systemTarget,
        commandTarget: action.payload?.commandTarget,
        extraData: action.payload?.extraData,
      };
    },
    deactivateTgsConflictMessage: (state) => {
      state.displayConflictMessage = false;
    },
    deActivatedisplayTGSScheduleModal: (state) => {
      state.displayTgsScheduleModal = false;
    },
    handleTgsSnowSensorDefaultTemp: (state, action) => {
      state.snowSensor.defaultTemp = action.payload;
    },
    setCurrentRunSystem: (state, action) => {
      state.currentRunSystem = action.payload;
    },
    setEBP: (state, action) => {
      state.EBP = action.payload;
    }
  },
});

export default tgsSwitchSlice;
export const selectTgsSwitch = (state) => state.tgsSwitch;

export const {
  fanOnlyToggler,
  expand,
  tgsInstantHeat,
  setTgsInfo,
  setTesInfo,
  setSettings,
  setSSRSettings,
  setSSRUpdate,
  setTgsFaults,
  setTesFaults,
  setTesGraphData,
  setGasGraphData,
  setOutsideGraphData,
  setEnclosureGraphData,
  setHeaterGraphData,
  tgsSnowSensor,

  tgsAddHeatingSchedule,
  tgsHeatingScheduleClear,
  tgsHeatingScheduleBeReady,
  tgsHeatingScheduleOpen,
  tgsHeatingScheduleCancel,

  tgsWindFactor,
  FanOnlyActivator,
  activateTgsSwitchStatus,
  deactivateTgsSwitchStatus,
  activateTgsConflictMessage,
  activatedisplayTGSScheduleModal,
  setDevicesConflicts,
  deactivateTgsConflictMessage,
  deActivatedisplayTGSScheduleModal,
  addTgsHeatingSchedule,
  handleTgsSnowSensorDefaultTemp,
  setCurrentRunSystem,
  setEBP,
} = tgsSwitchSlice.actions;
