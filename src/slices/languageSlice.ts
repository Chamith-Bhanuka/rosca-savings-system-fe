import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: { value: 'en' },
  reducers: {
    toggleLanguage: (state) => {
      state.value = state.value === 'en' ? 'si' : 'en';
    },
    setLanguage: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
