import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const settingsOfAdminSlice = createSlice({
  name: 'settingsOfAdmin',
  initialState,
  reducers: {
    sfTgs: {
      timeout: false,
      hpLp: false,
      bms: false,
    },
    sfTesOrEss: {
      ground: false,
      ssr: false,
      thermocouple: false,
      ssrLoadExceed: false,
    },
  },
});

export const {} = settingsOfAdminSlice.actions;
export const SelectSettingsOfAdmin = (state) => state.settingsOfAdmin;
export default settingsOfAdminSlice;
