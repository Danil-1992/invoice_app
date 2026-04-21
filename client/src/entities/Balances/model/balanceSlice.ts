import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { balanceType } from "../types/balancesSchema";
import { getUserBalance, toUpBalance } from "./balanceThunks";

type initialStateType = {
  balance: balanceType;
  balanceLoading: boolean;
  balanceError: string | null;
};

const initialState: initialStateType = {
  balance: { id: 0, credits: 0, user_id: 0 },
  balanceLoading: false,
  balanceError: null,
};

export const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<balanceType>) {
      state.balance = action.payload;
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(getUserBalance.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(getUserBalance.fulfilled, (state, { payload }) => {
        state.balance = payload;
        state.balanceLoading = false;
        state.balanceError = null;
      })
      .addCase(getUserBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError =
          action.error.message ?? "Ошибка при загрузке баланса";
      });
    builders
      .addCase(toUpBalance.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(toUpBalance.fulfilled, (state, { payload }) => {
        state.balance = payload;
        state.balanceLoading = false;
        state.balanceError = null;
      })
      .addCase(toUpBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError = action.error.message ?? "Ошибка при пополнении";
      });
  },
});

export default balanceSlice.reducer;
export const {setBalance} = balanceSlice.actions
