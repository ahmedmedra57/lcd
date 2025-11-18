import { configureStore } from '@reduxjs/toolkit';
import heaterStatusSlice from './slices/heaterStatusSlice';
import essSwitchSlice from './slices/essSwitchSlice';
import userSlice from './slices/userSlice';
import tgsSwitchSlice from './slices/tgsSwitchSlice';
import settingsOfEssSlice from './slices/settingsOfEssSlice';
import chartSlice from './slices/chartSlice';
import faultsSlice from './slices/faultsSlice';
import forceAndCommandStatusSlice from './slices/forceAndCommandSlice';
import ssrDescriptionSlice from './slices/ssrDescriptionSlice';
import unitsSlice from './slices/unitsSlice';
import settingsOfTgsTesSlice from './slices/settingsOfTgsTesSlice';
import settingsOfTgsSlice from './slices/settingsOfTgsSlice';
import settingsSystemIdentificationSlice from './slices/settingSystemIdentificationSlice';
import settingsOfSysSlice from './slices/settingsOfSysSlice';
import timerSlice from './slices/timerSlice';
import settingsOfAdminSlice from './slices/settingsOfAdminSlice';
import settingsSelectionSystemUOSSlice from './slices/settingsSelectSystemUOSSlice';
import settingsSelectSystemUOSSlice from './slices/settingsSelectSystemUOSSlice';

const store = configureStore({
  reducer: {
    ssrState: heaterStatusSlice.reducer,
    essSwitch: essSwitchSlice.reducer,
    user: userSlice.reducer,
    tgsSwitch: tgsSwitchSlice.reducer,
    settingsOfEss: settingsOfEssSlice.reducer,
    chart: chartSlice.reducer,
    faultsState: faultsSlice.reducer,
    forceAndCommandStatus: forceAndCommandStatusSlice.reducer,
    ssrDescription: ssrDescriptionSlice.reducer,
    unitsSettings: unitsSlice.reducer,
    settingsOfTgsTes: settingsOfTgsTesSlice.reducer,
    settingsOfTgs: settingsOfTgsSlice.reducer,
    systemIdentification: settingsSystemIdentificationSlice.reducer,
    settingsOfSys: settingsOfSysSlice.reducer,
    timer: timerSlice.reducer,
    settingsOfAdmin: settingsOfAdminSlice.reducer,
    selectSystemUOS: settingsSelectSystemUOSSlice.reducer,
  },
});

export default store;
