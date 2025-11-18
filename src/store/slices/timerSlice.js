import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
  setMinutes: null,
  setTime: null,
  pauseTime: null,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    handleTimer: (state, action) => {
      state.setMinutes = action.payload * 60;
      state.setTime = action.payload;
    },
    handleSaveTimer: (state, action) => {
      state.setMinutes = action.payload;
      state.pauseTime = moment();
    },
  },
});

export default timerSlice;
export const selectTimer = (state) => state.timer;
export const { handleTimer, handleSaveTimer } = timerSlice.actions;
