import { createAsyncThunk } from "@reduxjs/toolkit";
import { InvoiceService } from "../api/invoice.service";
import { InvoiceFormValues } from "../types/invoiceSchema";

export const getAllInvoicesByUser = createAsyncThunk(
  "invoice/byUser",
  async () => {
    return InvoiceService.getAllInvoicesByUser();
  }
);

export const createInvoice = createAsyncThunk(
  "invoice/create",
  async (data: InvoiceFormValues) => {
    const response = await InvoiceService.createInvoice(data);
    return response;
  }
);

export const generatePdf = createAsyncThunk(
  "invoice/getPdf",
  async (id: number) => {
    const result = await InvoiceService.generatePdf(id);
    return result;
  }
);
