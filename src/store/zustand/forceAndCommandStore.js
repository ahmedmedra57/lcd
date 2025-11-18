import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Force and Command Store
 * Manages thermocouple (TC) temperature selections for ESS and TGS/TES systems
 */
const useForceAndCommandStore = create(
  devtools(
    (set) => ({
      // === ESS SYSTEM TC SELECTIONS ===
      ess: {
        heaterTemp: { select: 'tc-01' },
        encloseTemp: { select: 'tc-01' },
        outsideTemp: { select: 'tc-01' },
      },

      // === TGS/TES SYSTEM TC SELECTIONS ===
      tgsTes: {
        outsideTemp: { select: 'tc-01' },
        burningChamberTemp: { select: 'tc-01' },
        heaterTemp: { select: 'tc-01' },
        encloseTemp: { select: 'tc-01' },
      },

      // === ACTIONS ===

      // ESS TC Selection
      setEssHeaterTemp: (tcSelect) =>
        set((state) => ({
          ess: { ...state.ess, heaterTemp: { select: tcSelect } },
        })),

      setEssEncloseTemp: (tcSelect) =>
        set((state) => ({
          ess: { ...state.ess, encloseTemp: { select: tcSelect } },
        })),

      setEssOutsideTemp: (tcSelect) =>
        set((state) => ({
          ess: { ...state.ess, outsideTemp: { select: tcSelect } },
        })),

      // Bulk update for ESS
      setEssAllTemps: (heaterTemp, encloseTemp, outsideTemp) =>
        set((state) => ({
          ess: {
            heaterTemp: { select: heaterTemp ?? state.ess.heaterTemp.select },
            encloseTemp: { select: encloseTemp ?? state.ess.encloseTemp.select },
            outsideTemp: { select: outsideTemp ?? state.ess.outsideTemp.select },
          },
        })),

      // TGS/TES TC Selection
      setTgsTesHeaterTemp: (tcSelect) =>
        set((state) => ({
          tgsTes: { ...state.tgsTes, heaterTemp: { select: tcSelect } },
        })),

      setTgsTesEncloseTemp: (tcSelect) =>
        set((state) => ({
          tgsTes: { ...state.tgsTes, encloseTemp: { select: tcSelect } },
        })),

      setTgsTesOutsideTemp: (tcSelect) =>
        set((state) => ({
          tgsTes: { ...state.tgsTes, outsideTemp: { select: tcSelect } },
        })),

      setTgsTesBurningChamberTemp: (tcSelect) =>
        set((state) => ({
          tgsTes: { ...state.tgsTes, burningChamberTemp: { select: tcSelect } },
        })),

      // Bulk update for TGS/TES
      setTgsTesAllTemps: (heaterTemp, encloseTemp, outsideTemp, burningChamberTemp) =>
        set((state) => ({
          tgsTes: {
            heaterTemp: { select: heaterTemp ?? state.tgsTes.heaterTemp.select },
            encloseTemp: { select: encloseTemp ?? state.tgsTes.encloseTemp.select },
            outsideTemp: { select: outsideTemp ?? state.tgsTes.outsideTemp.select },
            burningChamberTemp: {
              select: burningChamberTemp ?? state.tgsTes.burningChamberTemp.select,
            },
          },
        })),

      // Generic setter for dynamic property names (backward compatibility)
      setTcTemp: (system, property, tcSelect) =>
        set((state) => ({
          [system]: {
            ...state[system],
            [property]: { select: tcSelect },
          },
        })),

      // Reset to defaults
      resetForceAndCommand: () =>
        set({
          ess: {
            heaterTemp: { select: 'tc-01' },
            encloseTemp: { select: 'tc-01' },
            outsideTemp: { select: 'tc-01' },
          },
          tgsTes: {
            outsideTemp: { select: 'tc-01' },
            burningChamberTemp: { select: 'tc-01' },
            heaterTemp: { select: 'tc-01' },
            encloseTemp: { select: 'tc-01' },
          },
        }),
    }),
    { name: 'ForceAndCommandStore' }
  )
);

export default useForceAndCommandStore;
