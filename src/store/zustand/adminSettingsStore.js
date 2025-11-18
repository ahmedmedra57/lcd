import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Admin Settings Store
 * Consolidates: settingsOfAdminSlice, settingsOfSysSlice
 * Manages admin-level system configuration and fault simulation
 */
const useAdminSettingsStore = create(
  devtools(
    (set) => ({
      // === SIMULATE FAULTS - TGS ===
      simulateFaultsTgs: {
        timeout: false,
        hpLp: false,
        bms: false,
      },

      // === SIMULATE FAULTS - TES/ESS ===
      simulateFaultsTesEss: {
        ground: false,
        ssr: false,
        thermocouple: false,
        ssrLoadExceed: false,
      },

      // === SYSTEM CONTROL ===
      forceGasElectricState: false,

      // === ACTIONS ===

      // TGS Fault Simulation
      toggleTgsTimeout: () =>
        set((state) => ({
          simulateFaultsTgs: {
            ...state.simulateFaultsTgs,
            timeout: !state.simulateFaultsTgs.timeout,
          },
        })),

      toggleTgsHpLp: () =>
        set((state) => ({
          simulateFaultsTgs: {
            ...state.simulateFaultsTgs,
            hpLp: !state.simulateFaultsTgs.hpLp,
          },
        })),

      toggleTgsBms: () =>
        set((state) => ({
          simulateFaultsTgs: {
            ...state.simulateFaultsTgs,
            bms: !state.simulateFaultsTgs.bms,
          },
        })),

      setTgsFaults: (timeout, hpLp, bms) =>
        set({ simulateFaultsTgs: { timeout, hpLp, bms } }),

      resetTgsFaults: () =>
        set({ simulateFaultsTgs: { timeout: false, hpLp: false, bms: false } }),

      // TES/ESS Fault Simulation
      toggleTesEssGround: () =>
        set((state) => ({
          simulateFaultsTesEss: {
            ...state.simulateFaultsTesEss,
            ground: !state.simulateFaultsTesEss.ground,
          },
        })),

      toggleTesEssSsr: () =>
        set((state) => ({
          simulateFaultsTesEss: {
            ...state.simulateFaultsTesEss,
            ssr: !state.simulateFaultsTesEss.ssr,
          },
        })),

      toggleTesEssThermocouple: () =>
        set((state) => ({
          simulateFaultsTesEss: {
            ...state.simulateFaultsTesEss,
            thermocouple: !state.simulateFaultsTesEss.thermocouple,
          },
        })),

      toggleTesEssSsrLoadExceed: () =>
        set((state) => ({
          simulateFaultsTesEss: {
            ...state.simulateFaultsTesEss,
            ssrLoadExceed: !state.simulateFaultsTesEss.ssrLoadExceed,
          },
        })),

      setTesEssFaults: (ground, ssr, thermocouple, ssrLoadExceed) =>
        set({ simulateFaultsTesEss: { ground, ssr, thermocouple, ssrLoadExceed } }),

      resetTesEssFaults: () =>
        set({
          simulateFaultsTesEss: {
            ground: false,
            ssr: false,
            thermocouple: false,
            ssrLoadExceed: false,
          },
        }),

      // System Control
      setForceGasElectricSystem: (state) => set({ forceGasElectricState: state }),
      toggleForceGasElectricSystem: () =>
        set((state) => ({ forceGasElectricState: !state.forceGasElectricState })),

      // Reset All
      resetAdminSettings: () =>
        set({
          simulateFaultsTgs: { timeout: false, hpLp: false, bms: false },
          simulateFaultsTesEss: {
            ground: false,
            ssr: false,
            thermocouple: false,
            ssrLoadExceed: false,
          },
          forceGasElectricState: false,
        }),
    }),
    { name: 'AdminSettingsStore' }
  )
);

export default useAdminSettingsStore;
