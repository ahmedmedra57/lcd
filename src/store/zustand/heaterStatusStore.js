import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Heater Status Store
 * Manages SSR (Solid State Relay) heater status and element bank
 * Consolidates heaterStatusSlice + ssrDescriptionSlice
 */

// Initial state for a single SSR
const createSSRInitialState = () => ({
  select: 'tc-01',
  buttonStatus: true,
  switchName: null,
  description: [null, null, null],
  index: 1,
  specs: [
    {
      elementName: null,
      partNumber: null,
      current: null,
      wattage: null,
      voltage: null,
      lengths: null,
      currentCurrent: null,
    },
  ],
  reset: false,
});

const useHeaterStatusStore = create(
  devtools(
    (set, get) => ({
      // === SSR STATES (8 SSRs) ===
      ssr1: createSSRInitialState(),
      ssr2: { ...createSSRInitialState(), buttonStatus: 'flt' },
      ssr3: createSSRInitialState(),
      ssr4: createSSRInitialState(),
      ssr5: createSSRInitialState(),
      ssr6: createSSRInitialState(),
      ssr7: createSSRInitialState(),
      ssr8: createSSRInitialState(),

      // === ELEMENT BANK (from ssrDescriptionSlice) ===
      elementBank: {
        partNumberSuggestions: [],
        elementsOptions: [],
        lastAddedElement: {
          elementName: '',
          partNumber: '',
          current: '',
          wattage: '',
          voltage: '',
          lengths: '',
        },
      },

      // === SSR ACTIONS ===

      // Toggle SSR button status
      toggleSSR: (ssrId) =>
        set((state) => ({
          [ssrId]: {
            ...state[ssrId],
            buttonStatus: !state[ssrId].buttonStatus,
          },
        })),

      // Set SSR button status
      setSSRStatus: (ssrId, status) =>
        set((state) => ({
          [ssrId]: {
            ...state[ssrId],
            buttonStatus: status,
          },
        })),

      // Set TC selector for specific SSR
      setSSRSelector: (ssrId, tcSelect) =>
        set((state) => ({
          [ssrId]: {
            ...state[ssrId],
            select: tcSelect,
          },
        })),

      // Update SSR specifications
      updateSSRSpecs: (ssrId, specs) =>
        set((state) => ({
          [ssrId]: {
            ...state[ssrId],
            specs,
          },
        })),

      // Set SSR switch name
      setSSRSwitchName: (ssrId, name) =>
        set((state) => ({
          [ssrId]: {
            ...state[ssrId],
            switchName: name,
          },
        })),

      // Update SSR property by index
      updateSSRProperty: (ssrId, property, index, value) =>
        set((state) => {
          const ssr = state[ssrId];
          const updatedProperty = [...ssr[property]];
          updatedProperty[index] = value;
          return {
            [ssrId]: {
              ...ssr,
              [property]: updatedProperty,
            },
          };
        }),

      // Reset specific SSR
      resetSSR: (ssrId) =>
        set({
          [ssrId]: createSSRInitialState(),
        }),

      // === ELEMENT BANK ACTIONS ===

      // Load element bank with available elements
      loadElementBank: (elements) => {
        const partNumbers = elements?.map((item) => item.partNumber) || [];
        set((state) => ({
          elementBank: {
            ...state.elementBank,
            elementsOptions: elements || [],
            partNumberSuggestions: partNumbers,
          },
        }));
      },

      // Add new element to bank
      addElementToBank: (element) =>
        set((state) => ({
          elementBank: {
            ...state.elementBank,
            lastAddedElement: element,
            partNumberSuggestions: [
              ...state.elementBank.partNumberSuggestions,
              element.partNumber,
            ],
            elementsOptions: [...state.elementBank.elementsOptions, element],
          },
        })),

      // Update element in bank
      updateElementInBank: (partNumber, updatedElement) =>
        set((state) => ({
          elementBank: {
            ...state.elementBank,
            elementsOptions: state.elementBank.elementsOptions.map((elem) =>
              elem.partNumber === partNumber ? { ...elem, ...updatedElement } : elem
            ),
          },
        })),

      // Remove element from bank
      removeElementFromBank: (partNumber) =>
        set((state) => ({
          elementBank: {
            ...state.elementBank,
            elementsOptions: state.elementBank.elementsOptions.filter(
              (elem) => elem.partNumber !== partNumber
            ),
            partNumberSuggestions: state.elementBank.partNumberSuggestions.filter(
              (pn) => pn !== partNumber
            ),
          },
        })),

      // === BULK OPERATIONS ===

      // Update multiple SSRs at once
      updateMultipleSSRs: (updates) => {
        set((state) => {
          const newState = { ...state };
          Object.entries(updates).forEach(([ssrId, ssrData]) => {
            newState[ssrId] = { ...state[ssrId], ...ssrData };
          });
          return newState;
        });
      },

      // Reset all SSRs
      resetAllSSRs: () =>
        set({
          ssr1: createSSRInitialState(),
          ssr2: { ...createSSRInitialState(), buttonStatus: 'flt' },
          ssr3: createSSRInitialState(),
          ssr4: createSSRInitialState(),
          ssr5: createSSRInitialState(),
          ssr6: createSSRInitialState(),
          ssr7: createSSRInitialState(),
          ssr8: createSSRInitialState(),
        }),

      // === HELPERS ===

      // Get specific SSR state
      getSSR: (ssrId) => get()[ssrId],

      // Get all SSR states
      getAllSSRs: () => {
        const state = get();
        return {
          ssr1: state.ssr1,
          ssr2: state.ssr2,
          ssr3: state.ssr3,
          ssr4: state.ssr4,
          ssr5: state.ssr5,
          ssr6: state.ssr6,
          ssr7: state.ssr7,
          ssr8: state.ssr8,
        };
      },
    }),
    { name: 'HeaterStatusStore' }
  )
);

export default useHeaterStatusStore;
