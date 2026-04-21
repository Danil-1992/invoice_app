export interface IBalance {
  id: number;
  credits: number;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IBalancesList = IBalance[];