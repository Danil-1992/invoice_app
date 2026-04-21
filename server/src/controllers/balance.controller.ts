import { Request, Response } from "express";
import BalanceService from "../services/balance.service";
import TransactionService from "../services/transaction.service";

interface CustomRequest<TBody = {}> extends Request {
  user?: {
    id: number;
    email: string;
    role?: string;
  };
  body: TBody;
}

class BalanceController {
  static async getBalanceByUserId(req: CustomRequest, res: Response) {
    try {
      const user = req.user;
      console.log(user, "user");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const balance = await BalanceService.getBalanceByUserId(user.id);
      res.json(balance);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }

  static async topUpBalance(
    req: CustomRequest<{ summ: number }>,
    res: Response
  ) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { summ } = req.body;
      const updateBalance = await BalanceService.topUpBalance(summ, user.id);
      if (updateBalance) {
        await TransactionService.upTo(summ, user.id);
      }
      res.json(updateBalance);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async downToBalance(req: CustomRequest<{}>, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const updateBalances = await BalanceService.downToBalance(user.id);
      if (updateBalances) await TransactionService.downTo(user.id);
      res.status(201).json(updateBalances);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }
}

export default BalanceController;
