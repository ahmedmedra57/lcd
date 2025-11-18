import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gpState: true,
  ebpState: false,
  isEbpAvailbe: false,
  wifiState: true,
  alarmState: false,
};

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    setWifiState: (state, action) => {
      state.wifiState = action.payload;
    },
  },
});

export default chartSlice;
export const selectChart = (state) => state.chart;

export const { setWifiState } = chartSlice.actions;
