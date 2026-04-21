import { sequelize } from "../../shared/database";
import BalanceService from "../services/balance.service";
import InvoiceService from "../services/invoice.service";
import InvoiceItems from "../services/invoice_items.service";
import TransactionService from "../services/transaction.service";
import { IInvoices } from "../types/invoice.types";
import { Request, Response } from "express";
import RabbitInit from "../configs/rabbit.config";
import RedisService from "../redis/redis";

interface UserPayload {
  id: number;
  email: string;
  name?: string;
}

interface CreateInvoiceRequest {
  invoiceName: string;
  clientName: string;
  total: number;
  items: {
    name: string;
    quantity: number | null;
    price: number | null;
  }[];
}

interface Params {
  id: string;
}

interface CustomRequest extends Request {
  user?: UserPayload;
}

class InvoiceController {
  static async getInvoicesByUserId(req: CustomRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const cacheKey = `user:${user.id}:invoices`;
      const cached = await RedisService.get(cacheKey);

      if (cached) {
        console.log("Инвойсы из redis");
        return res.json(cached);
      }

      const invoices = await InvoiceService.getInvoicesItemsByUserId(user.id);
      await RedisService.set(cacheKey, invoices, 300);
      console.log("Кеш установлен");

      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }

  static async createInvoice(
    req: CustomRequest & { body: CreateInvoiceRequest },
    res: Response
  ) {
    const transaction = await sequelize.transaction();
    try {
      const user = req.user;
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const channel = await RabbitInit.initChannel("invoice", "pdf_publisher");

      const exchange = "invoice_exchange";
      const routingKey = "pdf_generate";
      await channel.assertExchange(exchange, "direct", { durable: true });

      const data = req.body;

      const newBalance = await BalanceService.downToBalance(
        user.id,
        transaction
      );

      const invoice: IInvoices = await InvoiceService.createInvoice(
        data.total,
        user.id,
        data.clientName,
        transaction
      );

      const invoiceItems = await InvoiceItems.createItems(
        data.items,
        invoice.id,
        transaction
      );

      await TransactionService.downTo(user.id, transaction);

      await transaction.commit();
      const cacheKey = `user:${user.id}:invoices`;
      await RedisService.del(cacheKey);

      channel.publish(
        exchange,
        "status_update",
        Buffer.from(
          JSON.stringify({
            invoiceId: invoice.id,
            status: "pending",
            event: "update_invoice",
            userId: user.id,
          })
        )
      );

      try {
        await delay(2000);
        channel.publish(
          exchange,
          routingKey,
          Buffer.from(
            JSON.stringify({ invoiceItems, invoice, userId: user.id })
          ),
          {
            persistent: true,
          }
        );
      } catch (rabbitError) {
        console.error("❌ Ошибка отправки в RabbitMQ:", rabbitError);
      }

      res.status(201).json({ newBalance, items: invoiceItems, invoice });
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async generatePdf(
    req: CustomRequest & { params: Params },
    res: Response
  ) {
    try {
      const user = req.user;
      const { id } = req.params;
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const invoice = await InvoiceService.getInvoiceByUserId(Number(id));
      if (!invoice) {
        return res.status(404).json({ message: "Инвойс не найден" });
      }
      if (user.id !== invoice.user_id) {
        return res.status(403).json({
          message:
            "Доступ запрещён: вы не являетесь владельцем этого документа",
        });
      }

      const pdf = `http://localhost:9000/invoices/invoice_${invoice.id}.pdf`;
      res.json(pdf);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default InvoiceController;
