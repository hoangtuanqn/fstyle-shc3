import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import AuthApi from '~/api-requests/auth.requests';
import LocalStorage from '~/utils/localStorage';

import type { UserType } from '~/types/auth';

type UserState = {
  user: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const initialState: UserState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

export const getInfo = createAsyncThunk('user/getInfo', async () => {
  const data = await AuthApi.getInfo();
  return data.result;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      LocalStorage.removeItem('access_token');
      LocalStorage.removeItem('refresh_token');
      LocalStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(getInfo.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
