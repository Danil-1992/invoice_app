import { Router } from "express";
import BalanceController from "../controllers/balance.controller";
import verifyAccessToken from "../middlewares/verifyAccessToken";

const balanceRouter = Router();

balanceRouter.get(
  "/byUser",
  verifyAccessToken,
  BalanceController.getBalanceByUserId
);
balanceRouter.post("/upTo", verifyAccessToken, BalanceController.topUpBalance);

export default balanceRouter;
