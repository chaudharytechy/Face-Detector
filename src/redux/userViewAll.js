// src/redux/userViewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ View All Users
export const viewAllUser = createAsyncThunk(
  'userView/viewAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:5000/user/viewAll', {
        withCredentials: true,
      });
      console.log(response.data,"res")
      return response.data.data;  // Return the list of users
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: 'Failed to fetch users' }
      );
    }
  }
);

const initialState = {
  userData: [], // Stores the list of all users
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message if any
};

const userViewSlice = createSlice({
  name: 'userView',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ View All Users
      .addCase(viewAllUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(viewAllUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userData = action.payload; // Store the list of users
        state.error = null;
      })
      .addCase(viewAllUser.rejected, (state, action) => {
        state.status = 'failed';
        state.userData = []; // Clear userData on failure
        state.error = action.payload;
      });
  },
});

export default userViewSlice.reducer;
