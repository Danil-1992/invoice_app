import { Transaction } from "sequelize";
import { UserBalance } from "../../shared/database";
import { IBalance, IBalancesList } from "../types/balance.types";

class BalanceService {
  static async getBalanceByUserId(user_id: number): Promise<IBalancesList> {
    return UserBalance.findOne({ where: { user_id } });
  }

  static async topUpBalance(
    amount: number,
    user_id: number
  ): Promise<IBalance> {
    if (amount < 1) {
      throw new Error("Нельзя пополнить баланс отрицательным числом");
    }

    const balance = await UserBalance.findOne({ where: { user_id } });

    if (!balance) {
      throw new Error("Баланс не найден!");
    }

    balance.credits += amount;
    await balance.save();
    return balance;
  }

  static async downToBalance(
    user_id: number,
    transaction?: Transaction
  ): Promise<IBalance> {
    const balance = await UserBalance.findOne({
      where: { user_id },
      transaction,
    });
    if (!balance) {
      throw new Error("Баланс не найден!");
    }

    if (balance.credits < 1) {
      throw new Error("Недостаточно средств для оплаты");
    }

    balance.credits -= 1;
    await balance.save();
    return balance;
  }
}

export default BalanceService;
