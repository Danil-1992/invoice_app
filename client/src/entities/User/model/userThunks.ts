import { createAsyncThunk } from '@reduxjs/toolkit';

import userService from '../api/user.service';
import { AxiosError } from 'axios';
import type { UserLogin, UserRegister } from '../types/userSchema';

export const signIn = createAsyncThunk('user/signin', async (data: UserLogin) => {
  try {
    const date = await userService.signIn(data);
    return date;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error);
      //   throw new Error((error.response?.data as { message: string }).message, { cause: error });
    }
    throw error;
  }
});

export const signUp = createAsyncThunk('user/signUp', async (data: UserRegister) => {
  const user = await userService.signUp(data);
  return user;
});

export const signOut = createAsyncThunk('user/signOut', async () => {
  await userService.signOut();
});

export const refresh = createAsyncThunk('user/refresh', async () => {
  const user = await userService.refresh();
  return user;
});
