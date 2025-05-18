// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Register user
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/user/register',
        userData,
        { withCredentials: true }
      );
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);

// ✅ Auth check
export const authCheck = createAsyncThunk(
  'user/authCheck',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('http://localhost:5000/user/me', {
        withCredentials: true,
      });
      const user = res.data?.user;
      if (!user) {
        return thunkAPI.rejectWithValue({ message: 'No user found in response' });
      }
      return user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: 'Unauthorized' }
      );
    }
  }
);

// ✅ Login user
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/user/login',
        credentials,
        { withCredentials: true }
      );
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

const initialState = {
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError: (state) => { 
      state.error = null; // Clear any error when user interacts with auth pages
      if (state.status === 'failed') {
        state.status = 'idle'; // Reset status if it's in failed state
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ✅ Auth Check
      .addCase(authCheck.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(authCheck.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(authCheck.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.error = action.payload;
      })

      // ✅ Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = userSlice.actions;
export default userSlice.reducer;
