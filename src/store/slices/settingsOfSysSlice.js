import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  forceGasElectricState: false,
};

export const settingsOfSysSlice = createSlice({
  name: 'settingsOfSys',
  initialState,
  reducers: {
    setForceGasAndElectricSystem: (state, action) => {
      state.forceGasElectricState = action.payload;
    },
  },
});

export const { setForceGasAndElectricSystem } = settingsOfSysSlice.actions;
export const SelectSettingsOfSys = (state) => state.settingsOfSys;
export default settingsOfSysSlice;
