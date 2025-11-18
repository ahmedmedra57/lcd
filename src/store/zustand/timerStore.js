import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import moment from 'moment';

/**
 * Timer Store
 * Manages timer-related state for heating schedules and countdowns
 */
const useTimerStore = create(
  devtools(
    (set) => ({
      // === STATE ===
      setMinutes: null,
      setTime: null,
      pauseTime: null,

      // === ACTIONS ===

      // Set timer in minutes (converts to seconds)
      setTimer: (minutes) =>
        set({
          setMinutes: minutes * 60,
          setTime: minutes,
        }),

      // Save current timer state with pause timestamp
      saveTimer: (remainingSeconds) =>
        set({
          setMinutes: remainingSeconds,
          pauseTime: moment(),
        }),

      // Clear timer
      clearTimer: () =>
        set({
          setMinutes: null,
          setTime: null,
          pauseTime: null,
        }),

      // Resume timer (clear pause time)
      resumeTimer: () => set({ pauseTime: null }),
    }),
    { name: 'TimerStore' }
  )
);

export default useTimerStore;
