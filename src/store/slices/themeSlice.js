import { createSlice } from '@reduxjs/toolkit';

const themeColors = {
  light: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    text: '#000000',
    border: '#e0e0e0',
    background: '#ffffff',
    // Add more color variables as needed
  },
  dark: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    text: '#ffffff',
    border: '#404040',
    background: '#121212',
    // Add more color variables as needed
  }
};

const initialState = {
  mode: 'light',
  colors: themeColors.light
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.colors = themeColors[state.mode];
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      state.colors = themeColors[action.payload];
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme;
export const selectThemeColors = (state) => state.theme.colors;

export default themeSlice.reducer;