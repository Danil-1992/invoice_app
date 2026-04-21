export interface IInvoices {
  id: number;
  status: string;
  total: number;
  pdf_url: string | null;
  user_id: number;
  client_name: string;
}

export type InvoicesType = IInvoices;
