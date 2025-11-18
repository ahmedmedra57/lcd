import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  buttonsOfSettings: {
    settingsEditButton: false,
    settingsCancelButton: false,
  },
  unitsMeasurement: false,
  snowSensorTemp: {
    tgsTempOnly: null,
    isFTgs: null,
  },

  tgsSelectTelemetry: {
    tgsHeaterTemp: null,
    tgsEncloseTemp: null,
    tgsOutSideTemp: null,
    tgsBurningChamberTemp: null,
  },
};

export const settingsOfTgsSlice = createSlice({
  name: 'settingsOfTgs',
  initialState,
  reducers: {
    // setTgsSettingsEditButton: (state) => {
    //   state.buttonsOfSettings.settingsEditButton = true;
    // },
    setTgsSettingsCancelButton: (state) => {
      // state.buttonsOfSettings.settingsCancelButton = true;
      // state.buttonsOfSettings.settingsEditButton = false;
    },
    setTgsSettingsApplyUnitsButton: (state, action) => {
      // state.buttonsOfSettings.settingsEditButton = false;
      // state.buttonsOfSettings.settingsCancelButton = false;
      state.buttonsOfSettings.unitsMeasurement = action.payload;
    },
    setTgsSettingsApplySnowSensorButton: (state, action) => {
      state.snowSensorTemp.tgsTempOnly = action.payload.tgsSnowSensor;
      state.snowSensorTemp.isFTgs = action.payload.isF;
    },
    setTgsSettingsApplyForceAndCommandButton: (state, action) => {
      // todo ess select arts

      // state.buttonsOfSettings.settingsCancelButton = false;
      state.tgsSelectTelemetry.tgsOutSideTemp =
        action.payload.tgsTesOutsideTemp;
      state.tgsSelectTelemetry.tgsBurningChamberTemp =
        action.payload.burningChamberTemp;
      state.tgsSelectTelemetry.tgsHeaterTemp = action.payload.tgsHeaterTemp;
      state.tgsSelectTelemetry.tgsEncloseTemp =
        action.payload.tgsTesEncloseTemp;
    },
    // setTgsSettingsApplyAdminButton: (state) => {
    //   state.buttonsOfSettings.settingsEditButton = false;
    //   state.buttonsOfSettings.settingsCancelButton = false;
    // },
    // setResetAllTgsSettingsButtons: (state) => {
    //   state.buttonsOfSettings.settingsEditButton = false;
    //   state.buttonsOfSettings.settingsCancelButton = false;
    // },
  },
});

export const {
  setTgsSettingsEditButton,
  setTgsSettingsCancelButton,
  setTgsSettingsApplyUnitsButton,
  setTgsSettingsApplySnowSensorButton,
  setTgsSettingsApplyForceAndCommandButton,
  setTgsSettingsApplyAdminButton,
  setResetAllTgsSettingsButtons,
} = settingsOfTgsSlice.actions;
export const SelectSettingsOfTgs = (state) => state.settingsOfTgs;
export default settingsOfTgsSlice;
