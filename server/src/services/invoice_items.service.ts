import { Transaction } from "sequelize";
import { InvoiceItem } from "../../shared/database";
import { ItemsType } from "../types/invoiceItems.types";

class InvoiceItems {
  static async createItems(
    items: ItemsType,
    invoiceId: number,
    transaction?: Transaction
  ) {
    const newItems: ItemsType = items.map((item) => ({
      ...item,
      invoice_id: invoiceId,
    }));
    return await InvoiceItem.bulkCreate(newItems, { transaction });
  }
}

export default InvoiceItems;
