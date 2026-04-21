import { Transaction } from "sequelize";
import { Invoice, InvoiceItem } from "../../shared/database";
import { IInvoices, InvoicesType } from "../types/invoice.types";

class InvoiceService {
  static async createInvoice(
    total: number,
    user_id: number,
    client_name: string,
    transaction?: Transaction
  ): Promise<InvoicesType> {
    console.log(total, user_id, client_name);

    const invoice: IInvoices = await Invoice.create(
      {
        status: "pending",
        user_id,
        client_name,
        total,
      },
      { transaction }
    );

    return invoice;
  }

  static async getInvoicesItemsByUserId(user_id: number) {
    const invoices: InvoicesType = await Invoice.findAll({
      where: { user_id },
      include: [{ model: InvoiceItem }],
    });
    return invoices;
  }

  static async getInvoiceByUserId(id: number) {
    const invoice: IInvoices = await Invoice.findOne({ where: { id } });
    if (!invoice) {
      throw new Error("Инвойс не существует");
    }
    return invoice;
  }
}

export default InvoiceService;
