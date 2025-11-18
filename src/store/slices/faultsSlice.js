import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  faults: true,
  receivedThermocoupleSetting: [],
  ess: {
    // from the backend
    faultsTypes: [
      'GROUND FAULT',
      'SSR FAULT',
      'THERMOCOUPLE FAILURE',
      'SSR LOAD EXCEED',
    ],
    message: [
      // 'GROUND FAULT - MBTA-BET EAST YARD BOSTON, MASSACHUSETES-TIME & DATE: 4:50am - 02/06/2022',
      // 'SSR FAULT - MBTA-BET EAST YARD BOSTON, MASSACHUSETES-TIME & DATE: 4:50am - 02/06/2022',
      // 'THERMOCOUPLE FAILURE - MBTA-BET EAST YARD BOSTON, MASSACHUSETES-TIME & DATE: 4:50am - 02/06/2022',
      // 'SSR LOAD EXCEED - MBTA-BET EAST YARD BOSTON, MASSACHUSETES-TIME & DATE: 4:50am - 02/06/2022',
    ],
    comments: [],
    forceOptions: [
      'max heat for 3 days',
      'max heat for 12 hours',
      'change and replace t/c',
    ],

    maxHeatWithTimer: false,
    setTime: null,
    displayForce: false,
    // 1. maxheat for 72hrs / 2. maxheat for 12hrs / 3. systme off
    selectedForce: [],
    timerDescriptions: false,

    // for button stylings
    isForceButtonClicked: false,
    isForceButtonActivated: false,
    displayForceSelectionBox: false,
    displayForceMessageBox: false,
    resetCounter: 3,
    activatedResetButton: { faultsIdx: null, status: false },
    attendButtonClicked: { faultsIdx: null, status: false },
    // storage for written action taken
    actionTaken: [],
    countDownTime: 0,
  },
  tgs: {
    faultsTypes: [
      'TIMEOUT FAULT',
      'HP/LP FAULT',
      'THERMOCOUPLE FAILURE',
      'BMS FAULT',
    ],
    message: [
      // 'TIMEOUT FAULT - MBTA-BET EAST YARD BOSTON, MASSACHUSETES-TIME & DATE: 4:50am - 02/06/2022',
      // 'HP/LP FAULT - MBTA-BET EAST YARD BOSTON, MASSACHUSETES-TIME & DATE: 4:50am - 02/06/2022',
      // 'BMS FAULT - MBTA-BET EAST YARD BOSTON, MASSACHUSETES-TIME & DATE: 4:50am - 02/06/2022',
    ],
    actionTaken: [],
    resetCounter: 3,
    activatedResetButton: { faultsIdx: null, status: false },
    attendButtonClicked: { faultsIdx: null, status: false },
  },
};

const faultsSlice = createSlice({
  name: 'faultsState',
  initialState,
  reducers: {
    handleForceSelection: (state, action) => {
      // Grap the selected force option
      // state.ess.selectedForce = state.ess.selectedForce.push(action.payload);
    },
    handleTimerDescription: (state, action) => {
      // set the description of timer if  true to 3 days else 12 hours at tes or ess switch
      state.ess.timerDescriptions = true;
    },
    setReceivedThermocoupleSetting: (state, action) => {
      if (typeof action.payload === 'object') {
        if (state.receivedThermocoupleSetting.find((item) => item.tc_no === action.payload.tc_no)) {
          state.receivedThermocoupleSetting = state.receivedThermocoupleSetting.map((item) => {
            if (item.tc_no === action.payload.tc_no) {
              return action.payload;
            }
            return item;
          });
        } else {
          state.receivedThermocoupleSetting = state.receivedThermocoupleSetting.concat(action.payload);
        }
      } else if (typeof action.payload === 'number') {
        state.receivedThermocoupleSetting = state.receivedThermocoupleSetting.filter((item) => item.tc_no !== action.payload);
      }
    },
    handleMaxHeatWithTimerOn: (state, action) => {
      // set selected force option
      state.ess.selectedForce = action.payload;
      // display force selection working box in switch
      state.ess.displayForce = true;
      // for Styling
      state.ess.isForceButtonActivated = true;
    },
    handleTimerCountdown: (state, action) => {
      state.ess.countDownTime = action.payload;
    },
    handleMaxHeatWithTimerOff: (state) => {
      // turn off timer
      state.ess.maxHeatWithTimer = false;
      // no show the force selection working box
      state.ess.displayForce = false;

      state.ess.timerDescriptions = false;
      // Stop the Timer
      // turn off the heater!!
    },
    handleDisplayForceStatusBox: (state, action) => {
      // display force selection working box
      state.displayForce = action.payload;
    },

    handleForceButtonClick: (state, action) => {
      state.ess.isForceButtonClicked = action.payload;
    },

    handleDisplayForceMessageBox: (state, action) => {
      state.ess.displayForceMessageBox = action.payload;
    },
    handleDisplayForceSelectionBox: (state, action) => {
      state.ess.displayForceSelectionBox = action.payload;
    },
    handleForceButtonActivated: (state, action) => {
      state.ess.isForceButtonActivated = action.payload;
      state.ess.isForceButtonClicked = false;
    },
    handleEsFaultsReset: (state, action) => {
      // 1. send reset to the backend
      if (state.ess.resetCounter > 0) {
        // 2. save the reset button to change its styles

        state.ess.activatedResetButton.faultsIdx = action.payload;
        state.ess.activatedResetButton.status = true;

        // 3. change reset button counter -1

        state.ess.resetCounter = state.ess.resetCounter - 1;
      } else {
        // Need to check the process
      }
    },
    handleGsFaultsReset: (state, action) => {
      // 1. send reset to the backend
      if (state.tgs.resetCounter > 0) {
        // 2. save the reset button to change its styles
        state.tgs.activatedResetButton.faultsIdx = action.payload;
        state.tgs.activatedResetButton.status = true;
        // 3. change reset button counter -1
        state.tgs.resetCounter = state.ess.resetCounter - 1;
      } else {
        // Need to check the process
      }
    },
    handleEsAttendButtonClick: (state, action) => {
      state.ess.attendButtonClicked.faultsIdx = action.payload;
      state.ess.attendButtonClicked.status =
        !state.ess.attendButtonClicked.status;
    },
    handleGsAttendButtonClick: (state, action) => {
      state.tgs.attendButtonClicked.faultsIdx = action.payload;
      state.tgs.attendButtonClicked.status =
        !state.tgs.attendButtonClicked.status;
    },
    handleEsRecordActionTaken: (state, action) => {
      state.ess.actionTaken = [
        {
          faultsIdx: action.payload.faultsIndexNumber,

          userName: action.payload.inputData.name,
          actionTaken: action.payload.inputData.comments,
        },
      ];
    },
    handleThermocoupleFaultSelectedOne: (state, action) => {
      state.ess.forceOptions[action.payload] = action.payload;
    },
    handleESSFaultsMessages: (state, action) => {
      state.ess.message = action.payload;
    },
    handleTGSFaultsMessages: (state, action) => {
      state.tgs.message = action.payload;
    },
  },
});

export default faultsSlice;
export const selectFaults = (state) => state.faultsState;
export const {
  handleForceSelection,
  setReceivedThermocoupleSetting,
  handleMaxHeatWithTimerOn,
  handleTimerCountdown,
  handleMaxHeatWithTimerOff,
  handleDisplayForceSelectionBox,
  handleDisplayForceMessageBox,
  handleForceButtonClick,
  handleForceButtonActivated,
  handleGsFaultsReset,
  handleEsFaultsReset,
  handleEsAttendButtonClick,
  handleGsAttendButtonClick,
  handleEsRecordActionTaken,
  handleDisplayForceStatusBox,
  handleTimerDescription,
  handleESSFaultsMessages,
  handleTGSFaultsMessages,
} = faultsSlice.actions;
