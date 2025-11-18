import { createSlice } from '@reduxjs/toolkit';

const initialState = { unitsMeasurement: false };

const unitsSlice = createSlice({
  name: 'unitsSettings',
  initialState,
  reducers: {
    toggleUnitsBetweenImperialMetric: (state) => {
      console.log(!state.unitsMeasurement);
      state.unitsMeasurement = !state.unitsMeasurement;
    },
  },
});

export default unitsSlice;
export const selectUnitsState = (state) => state.unitsSettings;
export const { toggleUnitsBetweenImperialMetric } = unitsSlice.actions;
