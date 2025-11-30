import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../slices/themeSlice.ts';
import menuReducer from '../slices/menuSlice.ts';
import languageReducer from '../slices/languageSlice.ts';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    menu: menuReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
