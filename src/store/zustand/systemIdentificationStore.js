import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * System Identification Store
 * Manages system configuration and identification details
 */
const useSystemIdentificationStore = create(
  devtools(
    persist(
      (set) => ({
        // === OPTIONS ===
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

        // === SYSTEM IDENTIFICATION ===
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

        // === ACTIONS ===

        // Add new SSR rating option
        addSSRRating: (rating) =>
          set((state) => ({
            ssrRatingOptions: [
              ...state.ssrRatingOptions.slice(0, -1),
              `${rating} amps`,
              state.ssrRatingOptions[state.ssrRatingOptions.length - 1],
            ],
          })),

        // Add new switch size option
        addSwitchSize: (size) =>
          set((state) => ({
            switchSizeOptions: [
              ...state.switchSizeOptions.slice(0, -1),
              `#${size}`,
              state.switchSizeOptions[state.switchSizeOptions.length - 1],
            ],
          })),

        // Add location name
        addLocationName: (location) =>
          set((state) => ({
            locationNameOptions: [...state.locationNameOptions, location],
          })),

        // Update entire system identification
        setSystemIdentification: (sysId) =>
          set({ sysIdentification: sysId }),

        // Update specific fields
        updateSysIdField: (field, value) =>
          set((state) => ({
            sysIdentification: {
              ...state.sysIdentification,
              [field]: value,
            },
          })),

        // Add switch to system
        addSwitch: (switchData) =>
          set((state) => ({
            sysIdentification: {
              ...state.sysIdentification,
              switches: [...state.sysIdentification.switches, switchData],
            },
          })),

        // Update specific switch
        updateSwitch: (index, switchData) =>
          set((state) => {
            const newSwitches = [...state.sysIdentification.switches];
            newSwitches[index] = { ...newSwitches[index], ...switchData };
            return {
              sysIdentification: {
                ...state.sysIdentification,
                switches: newSwitches,
              },
            };
          }),

        // Remove switch
        removeSwitch: (index) =>
          set((state) => ({
            sysIdentification: {
              ...state.sysIdentification,
              switches: state.sysIdentification.switches.filter((_, i) => i !== index),
            },
          })),

        // Toggle display select box for a switch
        toggleSwitchSelectBox: (switchIndex, boxIndex) =>
          set((state) => {
            const newSwitches = [...state.sysIdentification.switches];
            const displayBoxes = [...newSwitches[switchIndex].displaySelectBoxes];
            displayBoxes[boxIndex] = !displayBoxes[boxIndex];
            newSwitches[switchIndex] = {
              ...newSwitches[switchIndex],
              displaySelectBoxes: displayBoxes,
            };
            return {
              sysIdentification: {
                ...state.sysIdentification,
                switches: newSwitches,
              },
            };
          }),

        // Reset system identification
        resetSystemIdentification: () =>
          set({
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
          }),
      }),
      {
        name: 'system-identification-storage',
        partialize: (state) => ({
          sysIdentification: state.sysIdentification,
          ssrRatingOptions: state.ssrRatingOptions,
          switchSizeOptions: state.switchSizeOptions,
          locationNameOptions: state.locationNameOptions,
        }),
      }
    ),
    { name: 'SystemIdentificationStore' }
  )
);

export default useSystemIdentificationStore;
