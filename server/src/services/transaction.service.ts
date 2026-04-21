import { Transaction as SequelizeTransaction } from "sequelize";
import { Transaction as TransactionModel } from "../../shared/database";
import { ITransaction } from "../types/transactions.types";

class TransactionService {
  static async upTo(amount: number, user_id: number): Promise<ITransaction> {
    return TransactionModel.create({ type: "TOPUP", amount, user_id });
  }

  static async downTo(user_id: number, transaction?: SequelizeTransaction) {
    return TransactionModel.create(
      { type: "WITHDRAW", amount: 1, user_id },
      { transaction }
    );
  }
}

export default TransactionService;
