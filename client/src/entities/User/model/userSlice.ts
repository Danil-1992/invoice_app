import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../types/userSchema';
import { refresh, signIn, signOut, signUp } from './userThunks';

type UserState = {
  user: User | null;
  status: 'loading' | 'logged' | 'guest';
  error: string | null;
};

const initialState: UserState = {
  user: null,
  status: 'loading',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, { payload }) => {
        state.status = 'logged';
        state.user = payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'guest';
        state.user = null;
        state.error = action.error.message ?? 'Ошибка при регистрации';
      });

    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.status = 'logged';
        state.user = payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'guest';
        state.error = action.error.message ?? 'Ошибка при входе';
        state.user = null;
      });
    builder
      .addCase(signOut.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.error = null;
        state.user = null;
        state.status = 'guest';
      })
      .addCase(signOut.rejected, (state, action) => {
        state.status = 'logged';
        state.error = action.error.message ?? 'Ошибка при выходе';
      });
    builder
      .addCase(refresh.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.user = null;
      })
      .addCase(refresh.fulfilled, (state, { payload }) => {
        state.status = 'logged';
        state.user = payload.user;
        state.error = null;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.status = 'guest';
        state.user = null;
        state.error = action.error.message ?? 'Не получилось обновить страницу';
      });
  },
});

export default userSlice.reducer