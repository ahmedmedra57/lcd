import { createSlice } from '@reduxjs/toolkit';

const selectInitialState = { select: 'tc-01' };

const initialState = {
  essHeaterTemp: selectInitialState,
  essEncloseTemp: selectInitialState,
  essOutsideTemp: selectInitialState,
  tgsTesOutsideTemp: selectInitialState,
  burningChamberTemp: selectInitialState,
  tgsHeaterTemp: selectInitialState,
  tesHeaterTemp: selectInitialState,
  tgsTesEncloseTemp: selectInitialState,
};

const forceAndCommandStatusSlice = createSlice({
  name: 'forceAndCommandStatus',
  initialState,
  reducers: {
    setEssTcTemp: (state, action) => {
      state[action.payload.id].select = action.payload.data;
    },

    setTgsTesTcTemp: (state, action) => {
      state[action.payload.id].select = action.payload.data;
    },
  },
});

export const { setEssTcTemp, setTgsTesTcTemp } =
  forceAndCommandStatusSlice.actions;
export const selectForceAndCommand = (state) => state.forceAndCommandStatus;
export default forceAndCommandStatusSlice;
