// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
// import userReducer from '../features/user/userSlice';
import userViewAll from './redux/userViewAll'
import userReducer from"./redux/userSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    userView:userViewAll
  },
});
