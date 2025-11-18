import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  heatingSysOptions: ['ess', 'tgs', 'tes', 'hp', 'ate'],
  switchSizeOptions: [
    '#10',
    '#15',
    '#20',
    '#30',
    '#40',
    '#50',
    '#60',
    '#70',
    '#80',
    '#90',
    '#100',
  ],
  ssrRatingOptions: [
    '10 amps',
    '15 amps',
    '20 amps',
    '30 amps',
    '40 amps',
    '50 amps',
    '70 amps',
    '100 amps',
  ],
  locationNameOptions: [
    'cp6',
    'campbell st',
    'swift interlocking #15',
    'swift interlocking #10',
    'swift interlocking dia cr',
    'foxboro',
    'tufts interlocking',
    'ti movable frog points',
    'bet west',
    'bet east',
    'lowill junction',
    'willows',
    'wilson',
  ],

  sysIdentification: {
    locationName: '',
    civicAddress: '',
    numOfSwitches: '',
    gasType: '',
    sysId: '',
    switches: [
      {
        switchName: '',
        heatingSystem: '',
        application: '',
        switchSize: '',
        ssrRating: '',
        displaySelectBoxes: [false, false, false],
      },
    ],
  },
};

const settingsSystemIdentificationSlice = createSlice({
  name: 'systemIdentification',
  initialState,
  reducers: {
    handleAddNewSSRRating: (state, action) => {
      state.ssrRatingOptions.splice(
        state.ssrRatingOptions.length - 1,
        0,
        action.payload + 'amps'
      );
    },
    handleAddNewSwitchSize: (state, action) => {
      state.switchSizeOptions.splice(
        state.switchSizeOptions.length - 1,
        0,
        '#' + action.payload
      );
    },
    handleAdditionalSystemIdentification: (state, action) => {
      state.sysIdentification = action.payload;
    },
  },
});

export default settingsSystemIdentificationSlice;
export const selectSystemIdentification = (state) => state.systemIdentification;
export const {
  handleAddNewSSRRating,
  handleAddNewSwitchSize,
  handleAdditionalSystemIdentification,
} = settingsSystemIdentificationSlice.actions;
