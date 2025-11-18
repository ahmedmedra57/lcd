import { createSlice } from '@reduxjs/toolkit';

const selectInitialState = { select: 'tc-01' };
const initialState = {
  // buttonsOfSettings: {
  //   settingsEditButton: false,
  //   settingsCancelButton: false,
  //   settingsApplyButton: false,
  // },
  unitsMeasurement: false,
  windFactorTemp: {
    low: null,
    med: null,
    high: null,
    extreme: null,
    isF: null,
  },
  snowSensorTemp: {
    tgsTemp: null,
    tesTemp: null,
    isFTgsTes: null,
  },
  tgsTesSelectTelemetry: {
    tgsHeaterTemp: null,
    tesHeaterTemp: null,
    tgsTesEncloseTemp: null,
    tgsTesOutSideTemp: null,
    tgsTesBurningChamberTemp: null,
  },
  valveInputs: { start: null, min: null, max: null },
  gasType: null,
  thermocouple: null,
  allSelects: {
    selectAtsTgsState: null,
    selectAtsTesState: null,
    selectTcSysState: null,
  },
  tgsTesTelemetry: {
    tgsTesOutsideTemp: selectInitialState,
    burningChamberTemp: selectInitialState,
    tgsHeaterTemp: selectInitialState,
    tesHeaterTemp: selectInitialState,
    tgsTesEncloseTemp: selectInitialState,
  },
};

export const settingsOfTgsTesSlice = createSlice({
  name: 'settingsOfTgsTes',
  initialState,
  reducers: {
    // setTgsTesSettingsApplyUnitsButton: (state, action) => {
    //   state.buttonsOfSettings.unitsMeasurement = action.payload;
    //   state.buttonsOfSettings.settingsEditButton = false;
    //   state.buttonsOfSettings.settingsCancelButton = false;
    // },

    setTgsTesSettingsApplyWindFactor: (state, action) => {
      state.windFactorTemp.low = action.payload.windFactor.lowWind;
      state.windFactorTemp.med = action.payload.windFactor.medWind;
      state.windFactorTemp.high = action.payload.windFactor.highWind;
      state.windFactorTemp.extreme = action.payload.windFactor.extremeWind;
    },
    setTgsTesSettingsApplySnowSensorButton: (state, action) => {
      state.snowSensorTemp.tgsTemp = action.payload.tgsSnowSensor;
      state.snowSensorTemp.tesTemp = action.payload.tesSnowSensor;
      state.snowSensorTemp.isFTgsTes = action.payload.isF;
    },
    setTgsTesSettingsApplyForceAndCommandButton: (state, action) => {
      // state.buttonsOfSettings.settingsEditButton = false;
      // state.buttonsOfSettings.settingsCancelButton = false;
      state.tgsTesSelectTelemetry.tgsTesOutSideTemp =
        action.payload.tgsTesOutsideTemp;
      state.tgsTesSelectTelemetry.tgsTesBurningChamberTemp =
        action.payload.burningChamberTemp;
      state.tgsTesSelectTelemetry.tgsHeaterTemp = action.payload.tgsHeaterTemp;
      state.tgsTesSelectTelemetry.tesHeaterTemp = action.payload.tesHeaterTemp;
      state.tgsTesSelectTelemetry.tgsTesEncloseTemp =
        action.payload.tgsTesEncloseTemp;
    },
    setTgsTesSettingsApplyAdminButton: (state) => {
      state.buttonsOfSettings.settingsEditButton = false;
      state.buttonsOfSettings.settingsCancelButton = false;
    },
    // setTgsTesResetAllSettingsButtons: (state) => {
    //   state.buttonsOfSettings.settingsEditButton = false;
    //   state.buttonsOfSettings.settingsCancelButton = false;
    // },
    setValveInputs: (state, action) => {
      state.valveInputs.start = action.payload.first;
      state.valveInputs.min = action.payload.second;
      state.valveInputs.max = action.payload.third;
    },
    setGasType: (state, action) => {
      state.gasType = action.payload;
    },
    //admin: this is used for ess and tes
    setThermocouple: (state, action) => {
      state.thermocouple = action.payload;
    },
    setTgsAts: (state, action) => {
      state.allSelects.selectAtsTgsState = action.payload;
    },
    setTesAts: (state, action) => {
      state.allSelects.selectAtsTesState = action.payload;
    },
    setTgsTesTelemetry: (state, action) => {
      state.tgsTesTelemetry.tgsTesOutsideTemp = action.payload.tgsTesOutside;
      state.tgsTesTelemetry.burningChamberTemp = action.payload.burningChamber;
      state.tgsTesTelemetry.tgsHeaterTemp = action.payload.tgsHeater;
      state.tgsTesTelemetry.tesHeaterTemp = action.payload.tesHeater;
      state.tgsTesTelemetry.tgsTesEncloseTemp = action.payload.tgsTesEnclose;
    },
  },
});

export const {
  setTgsTesSettingsEditButton,
  setTgsTesSettingsCancelButton,
  setTgsTesSettingsApplyButton,
  setTgsTesResetAllSettingsButtons,
  setTgsTesSettingsApplyUnitsButton,
  setTgsTesSettingsApplySnowSensorButton,
  setTgsTesSettingsApplyForceAndCommandButton,
  setTgsTesSettingsApplyAdminButton,
  setValveInputs,
  setTgsTesSettingsApplyWindFactor,
  setGasType,
  setThermocouple,
  setTgsAts,
  setTesAts,
  setTgsTesTelemetry,
} = settingsOfTgsTesSlice.actions;
export const selectSettingsOfTgsTes = (state) => state.settingsOfTgsTes;
export default settingsOfTgsTesSlice;
