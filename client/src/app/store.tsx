import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../entities/User/model/userSlice";
import balanceSlice from "../entities/Balances/model/balanceSlice";
import invoiceSlice from "../entities/Invoice/model/invoiceSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    balance: balanceSlice,
    invoices: invoiceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
