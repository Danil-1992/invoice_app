import { createAsyncThunk } from "@reduxjs/toolkit";
import { BalanceService } from "../api/balances.service";
import { AxiosError } from "axios";
import { ZodError } from "zod";

export const getUserBalance = createAsyncThunk(
  "balance/user",
  async (_, { rejectWithValue }) => {
    try {
      return await BalanceService.getBalance();
    } catch (error) {
      console.error("Balance fetch failed:", error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return rejectWithValue("Сессия истекла, войдите снова");
        }
        if (error.response?.status === 403) {
          return rejectWithValue("Доступ запрещён");
        }
        if (error.response?.status === 500) {
          return rejectWithValue("Ошибка на сервере, попробуйте позже");
        }
      }
      if (error instanceof ZodError) {
        return rejectWithValue("Ошибка формата данных");
      }

      return rejectWithValue("Не удалось загрузить баланс");
    }
  }
);

export const toUpBalance = createAsyncThunk(
  "balance/upTo",
  async (summ: number, { rejectWithValue }) => {
    try {
      return await BalanceService.toUpBalance(summ);
    } catch (error) {
      console.error("Ошибка при пополнении баланса:", error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return rejectWithValue("Сессия истекла, войдите снова");
        }
        if (error.response?.status === 403) {
          return rejectWithValue("Доступ запрещён");
        }
        if (error.response?.status === 500) {
          return rejectWithValue("Ошибка на сервере, попробуйте позже");
        }
      }
      if (error instanceof ZodError) {
        return rejectWithValue("Ошибка формата данных");
      }
      return rejectWithValue("Не удалось пополнить баланс");
    }
  }
);
