import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Chart Store
 * Manages chart-related UI states (wifi, alarms, power states)
 */
const useChartStore = create(
  devtools(
    (set) => ({
      // === STATE ===
      gpState: true,
      ebpState: false,
      isEbpAvailable: false,
      wifiState: true,
      alarmState: false,

      // === ACTIONS ===

      // WiFi State
      setWifiState: (state) => set({ wifiState: state }),
      toggleWifiState: () => set((state) => ({ wifiState: !state.wifiState })),

      // GP State
      setGpState: (state) => set({ gpState: state }),
      toggleGpState: () => set((state) => ({ gpState: !state.gpState })),

      // EBP State
      setEbpState: (state) => set({ ebpState: state }),
      toggleEbpState: () => set((state) => ({ ebpState: !state.ebpState })),
      setEbpAvailable: (available) => set({ isEbpAvailable: available }),
      setEBP: (ebp) => set({ ebpState: ebp, isEbpAvailable: ebp != null }),

      // Alarm State
      setAlarmState: (state) => set({ alarmState: state }),
      toggleAlarmState: () => set((state) => ({ alarmState: !state.alarmState })),

      // Reset all states
      resetChart: () =>
        set({
          gpState: true,
          ebpState: false,
          isEbpAvailable: false,
          wifiState: true,
          alarmState: false,
        }),
    }),
    { name: 'ChartStore' }
  )
);

export default useChartStore;
