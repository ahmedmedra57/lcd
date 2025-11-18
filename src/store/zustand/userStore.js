import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import moment from 'moment';

/**
 * User Store
 * Manages user session, admin access, and system-wide UI states
 */
const useUserStore = create(
  devtools(
    persist(
      (set) => ({
        // === AUTHENTICATION & ACCESS ===
        isAdministrator: false,
        isPasswordOpen: false,
        adminPassword: 'ATEF61', // TODO: Move to environment variable

        // === USER INFO ===
        userId: null,

        // === SYSTEM STATE ===
        isEssSwitch: false,
        isTesSwitch: true,
        isExpanded: false,
        isGas: true,
        isInhand: null,

        // === TELEMETRY ===
        currentTemp: null,
        outsideTemp: null,
        enclosureTemp: null,
        hoursOfUsage: null,

        // === DATE & WEATHER ===
        dateAndWeather: {
          date: moment().format('MMMM dddd DD, YYYY'),
          weather: null,
          iconSrc: '/static/images/weather-sunny.svg',
        },

        // === ACTIONS ===

        // Authentication
        setAdminAccess: (isAdmin) => set({ isAdministrator: isAdmin }),
        togglePasswordModal: () =>
          set((state) => ({ isPasswordOpen: !state.isPasswordOpen })),
        openPasswordModal: () => set({ isPasswordOpen: true }),
        closePasswordModal: () => set({ isPasswordOpen: false }),

        // User Info
        setUserId: (id) => set({ userId: id }),

        // System Switches
        setEssSwitch: (isActive) => set({ isEssSwitch: isActive }),
        setTesSwitch: (isActive) => set({ isTesSwitch: isActive }),
        toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
        setExpanded: (isExpanded) => set({ isExpanded }),

        // System Type
        setIsGas: (isGas) => set({ isGas }),
        setIsInhand: (isInhand) => set({ isInhand }),

        // Telemetry
        setCurrentTemp: (temp) => set({ currentTemp: temp }),
        setOutsideTemp: (temp) => set({ outsideTemp: temp }),
        setEnclosureTemp: (temp) => set({ enclosureTemp: temp }),
        setHoursOfUsage: (hours) => set({ hoursOfUsage: hours }),

        updateTelemetry: (telemetry) =>
          set({
            currentTemp: telemetry.currentTemp ?? null,
            outsideTemp: telemetry.outsideTemp ?? null,
            enclosureTemp: telemetry.enclosureTemp ?? null,
            hoursOfUsage: telemetry.hoursOfUsage ?? null,
          }),

        // Date & Weather
        updateWeather: (weather, iconSrc) =>
          set((state) => ({
            dateAndWeather: {
              ...state.dateAndWeather,
              weather,
              iconSrc,
            },
          })),

        updateDate: () =>
          set((state) => ({
            dateAndWeather: {
              ...state.dateAndWeather,
              date: moment().format('MMMM dddd DD, YYYY'),
            },
          })),

        // Reset
        logout: () =>
          set({
            isAdministrator: false,
            isPasswordOpen: false,
            userId: null,
          }),
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({
          isAdministrator: state.isAdministrator,
          userId: state.userId,
        }),
      }
    ),
    { name: 'UserStore' }
  )
);

export default useUserStore;
