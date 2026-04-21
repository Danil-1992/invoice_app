import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { changeInvoiceType, InvoicesList } from "../types/invoiceSchema";
import { createInvoice, getAllInvoicesByUser } from "./invoiceThunks";

type initialStateType = {
  invoices: InvoicesList;
  invoiceLoading: boolean;
  invoiceError: string | null;
};

const initialState: initialStateType = {
  invoices: [],
  invoiceLoading: false,
  invoiceError: null,
};

export const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    changeStatus(state, action: PayloadAction<changeInvoiceType>) {
      console.log(action.payload);

      let invoice = state.invoices.find(
        (invoice) => invoice.id === action.payload.id
      );
      if (invoice) {
        invoice.status = action.payload.status;
      }
    },
    clearInvoiceError(state) {
      state.invoiceError = null;
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(getAllInvoicesByUser.pending, (state) => {
        state.invoiceLoading = true;
        state.invoiceError = null;
      })
      .addCase(getAllInvoicesByUser.fulfilled, (state, { payload }) => {
        state.invoices = payload;
        state.invoiceLoading = false;
        state.invoiceError = null;
      })
      .addCase(getAllInvoicesByUser.rejected, (state, action) => {
        state.invoiceLoading = false;
        state.invoiceError =
          action.error.message ?? "Ошибка при загрузке инвойсов";
      });
    builders
      .addCase(createInvoice.pending, (state) => {
        state.invoiceLoading = true;
        state.invoiceError = null;
      })
      .addCase(createInvoice.fulfilled, (state, { payload }) => {
        state.invoices.push({
          ...payload.invoice,
          Invoice_items: payload.items,
        });
        state.invoiceLoading = false;
        state.invoiceError = null;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.invoiceLoading = false;
        state.invoiceError =
          action.error.message ?? "Ошибка при создании отчета";
      });
  },
});

export default invoiceSlice.reducer;
export const { changeStatus, clearInvoiceError } = invoiceSlice.actions;
