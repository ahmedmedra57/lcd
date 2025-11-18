import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Faults Store
 * Manages fault messages, force options, and reset actions for ESS and TGS systems
 */

const FAULT_TYPES_ESS = [
  'GROUND FAULT',
  'SSR FAULT',
  'THERMOCOUPLE FAILURE',
  'SSR LOAD EXCEED',
];

const FAULT_TYPES_TGS = [
  'TIMEOUT FAULT',
  'HP/LP FAULT',
  'THERMOCOUPLE FAILURE',
  'BMS FAULT',
];

const FORCE_OPTIONS = [
  'max heat for 3 days',
  'max heat for 12 hours',
  'change and replace t/c',
];

const useFaultsStore = create(
  devtools(
    (set) => ({
      // === GLOBAL STATE ===
      faults: true,
      receivedThermocoupleSetting: [],

      // === ESS FAULTS ===
      ess: {
        faultTypes: FAULT_TYPES_ESS,
        messages: [],
        comments: [],
        forceOptions: FORCE_OPTIONS,
        maxHeatWithTimer: false,
        setTime: null,
        displayForce: false,
        selectedForce: [],
        timerDescriptions: false,
        isForceButtonClicked: false,
        isForceButtonActivated: false,
        displayForceSelectionBox: false,
        displayForceMessageBox: false,
        resetCounter: 3,
        activatedResetButton: { faultsIdx: null, status: false },
        attendButtonClicked: { faultsIdx: null, status: false },
        actionTaken: [],
        countDownTime: 0,
      },

      // === TGS FAULTS ===
      tgs: {
        faultTypes: FAULT_TYPES_TGS,
        messages: [],
        actionTaken: [],
        resetCounter: 3,
        activatedResetButton: { faultsIdx: null, status: false },
        attendButtonClicked: { faultsIdx: null, status: false },
      },

      // === ACTIONS ===

      // Global
      setFaultsActive: (isActive) => set({ faults: isActive }),

      // Thermocouple Settings
      addThermocoupleSetting: (setting) =>
        set((state) => {
          const existing = state.receivedThermocoupleSetting.find(
            (item) => item.tc_no === setting.tc_no
          );

          if (existing) {
            return {
              receivedThermocoupleSetting: state.receivedThermocoupleSetting.map((item) =>
                item.tc_no === setting.tc_no ? setting : item
              ),
            };
          }

          return {
            receivedThermocoupleSetting: [
              ...state.receivedThermocoupleSetting,
              setting,
            ],
          };
        }),

      removeThermocoupleSetting: (tcNo) =>
        set((state) => ({
          receivedThermocoupleSetting: state.receivedThermocoupleSetting.filter(
            (item) => item.tc_no !== tcNo
          ),
        })),

      // ESS Fault Messages
      setEssFaultMessages: (messages) =>
        set((state) => ({
          ess: { ...state.ess, messages },
        })),

      addEssFaultMessage: (message) =>
        set((state) => ({
          ess: { ...state.ess, messages: [...state.ess.messages, message] },
        })),

      // TGS Fault Messages
      setTgsFaultMessages: (messages) =>
        set((state) => ({
          tgs: { ...state.tgs, messages },
        })),

      addTgsFaultMessage: (message) =>
        set((state) => ({
          tgs: { ...state.tgs, messages: [...state.tgs.messages, message] },
        })),

      // ESS Force Options
      setEssSelectedForce: (selectedForce) =>
        set((state) => ({
          ess: { ...state.ess, selectedForce },
        })),

      activateEssMaxHeatWithTimer: (selectedForce) =>
        set((state) => ({
          ess: {
            ...state.ess,
            selectedForce,
            displayForce: true,
            isForceButtonActivated: true,
          },
        })),

      deactivateEssMaxHeatWithTimer: () =>
        set((state) => ({
          ess: {
            ...state.ess,
            maxHeatWithTimer: false,
            displayForce: false,
            timerDescriptions: false,
          },
        })),

      setEssCountDownTime: (time) =>
        set((state) => ({
          ess: { ...state.ess, countDownTime: time },
        })),

      // ESS UI States
      setEssDisplayForce: (display) =>
        set((state) => ({
          ess: { ...state.ess, displayForce: display },
        })),

      setEssForceButtonClicked: (clicked) =>
        set((state) => ({
          ess: { ...state.ess, isForceButtonClicked: clicked },
        })),

      setEssForceButtonActivated: (activated) =>
        set((state) => ({
          ess: {
            ...state.ess,
            isForceButtonActivated: activated,
            isForceButtonClicked: false,
          },
        })),

      setEssDisplayForceMessageBox: (display) =>
        set((state) => ({
          ess: { ...state.ess, displayForceMessageBox: display },
        })),

      setEssDisplayForceSelectionBox: (display) =>
        set((state) => ({
          ess: { ...state.ess, displayForceSelectionBox: display },
        })),

      setEssTimerDescriptions: (show) =>
        set((state) => ({
          ess: { ...state.ess, timerDescriptions: show },
        })),

      // ESS Reset
      resetEssFault: (faultsIdx) =>
        set((state) => {
          if (state.ess.resetCounter > 0) {
            return {
              ess: {
                ...state.ess,
                activatedResetButton: { faultsIdx, status: true },
                resetCounter: state.ess.resetCounter - 1,
              },
            };
          }
          return state;
        }),

      resetEssResetCounter: () =>
        set((state) => ({
          ess: { ...state.ess, resetCounter: 3 },
        })),

      // TGS Reset
      resetTgsFault: (faultsIdx) =>
        set((state) => {
          if (state.tgs.resetCounter > 0) {
            return {
              tgs: {
                ...state.tgs,
                activatedResetButton: { faultsIdx, status: true },
                resetCounter: state.tgs.resetCounter - 1,
              },
            };
          }
          return state;
        }),

      resetTgsResetCounter: () =>
        set((state) => ({
          tgs: { ...state.tgs, resetCounter: 3 },
        })),

      // Attend Button
      toggleEssAttendButton: (faultsIdx) =>
        set((state) => ({
          ess: {
            ...state.ess,
            attendButtonClicked: {
              faultsIdx,
              status: !state.ess.attendButtonClicked.status,
            },
          },
        })),

      toggleTgsAttendButton: (faultsIdx) =>
        set((state) => ({
          tgs: {
            ...state.tgs,
            attendButtonClicked: {
              faultsIdx,
              status: !state.tgs.attendButtonClicked.status,
            },
          },
        })),

      // Action Taken
      recordEssActionTaken: (faultsIdx, userName, comments) =>
        set((state) => ({
          ess: {
            ...state.ess,
            actionTaken: [
              {
                faultsIdx,
                userName,
                actionTaken: comments,
              },
            ],
          },
        })),

      recordTgsActionTaken: (faultsIdx, userName, comments) =>
        set((state) => ({
          tgs: {
            ...state.tgs,
            actionTaken: [
              {
                faultsIdx,
                userName,
                actionTaken: comments,
              },
            ],
          },
        })),

      // Reset All
      resetAllFaults: () =>
        set((state) => ({
          ess: {
            ...state.ess,
            messages: [],
            actionTaken: [],
            resetCounter: 3,
            activatedResetButton: { faultsIdx: null, status: false },
            attendButtonClicked: { faultsIdx: null, status: false },
            displayForce: false,
            isForceButtonActivated: false,
            isForceButtonClicked: false,
          },
          tgs: {
            ...state.tgs,
            messages: [],
            actionTaken: [],
            resetCounter: 3,
            activatedResetButton: { faultsIdx: null, status: false },
            attendButtonClicked: { faultsIdx: null, status: false },
          },
        })),
    }),
    { name: 'FaultsStore' }
  )
);

export default useFaultsStore;
