export interface IItems {
  id?: number;
  name: string;
  quantity: number;
  price: number;
  total?: number;
  invoice_id?: number;
}

export type ItemsType = IItems[];
