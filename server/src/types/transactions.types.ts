export interface ITransaction {
  id: number;
  type: string;
  amount: number;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ITransactionList = ITransaction[];
