import { balanceSchema } from "../types/balancesSchema";
import axiosInstance from "../../../shared/api/axiosInstance";

export const BalanceService = {
  async getBalance() {
    const responce = await axiosInstance.get("/balance/byUser");
    const validDate = balanceSchema.parse(responce.data);
    return validDate;
  },

  async toUpBalance(summ: number) {
    const response = await axiosInstance.post("/balance/upTo", { summ });
    const validDate = balanceSchema.parse(response.data);
    return validDate;
  },
};
