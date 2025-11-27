import { createSlice } from '@reduxjs/toolkit';

const initialTheme = localStorage.getItem('theme') || 'dark';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    value: initialTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.value);
    },
    setTheme: (state, action) => {
      state.value = action.payload;
      localStorage.setItem('theme', state.value);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
