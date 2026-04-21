import axiosInstance from "../../../shared/api/axiosInstance";
import {
  CreateInvoiceResponseSchema,
  InvoiceFormValues,
  InvoicesListSchema,
} from "../types/invoiceSchema";
import { errorHandle } from "../../../shared/error/error";

export const InvoiceService = {
  async getAllInvoicesByUser() {
    try {
      const response = await axiosInstance.get("/invoice/invoicesByUser");
      const validDate = InvoicesListSchema.parse(response.data);
      return validDate;
    } catch (error) {
      errorHandle(error);
    }
  },

  async createInvoice(data: InvoiceFormValues) {
    try {
      const response = await axiosInstance.post("/invoice/pdf", data);
      const validDate = CreateInvoiceResponseSchema.parse(response.data);
      return validDate;
    } catch (error: any) {
      errorHandle(error);
    }
  },

  async generatePdf(id: number) {
    try {
      const responce = await axiosInstance.get(`/invoice/${id}`);
      return responce.data;
    } catch (error) {
      errorHandle(error);
    }
  },
};
