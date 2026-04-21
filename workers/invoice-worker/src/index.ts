import dotenv from "dotenv";
import RabbitInit from "./configs/rabbit.config";
const db = require("/app/shared/database");
const Invoice = db.Invoice;

dotenv.config();

async function invoiceUpdaterWorker() {
  console.log("🚀 Запуск Invoice Updater Worker...");

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  try {
    const channel = await RabbitInit.initChannel(
      "invoice",
      "updateInvoice_consumer"
    );

    const exchange = "invoice_exchange";
    const routingKey = "update_invoice";
    const queue = "updateInvoice_queue";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log("Начинаю обновлять данные в invoice", content);
          const invoice = await Invoice.findByPk(content.invoiceId);
          if (invoice) {
            invoice.status = "completed";
            invoice.pdf_url = content.pdfName;
            await invoice.save();

            await delay(2000);
            channel.publish(
              exchange,
              "status_update",
              Buffer.from(
                JSON.stringify({
                  status: "completed",
                  event: "update_invoice",
                  userId: content.userId,
                  invoiceId: content.invoiceId,
                  pdfUrl: content.pdfUrl,
                })
              )
            );
            console.log("Invoice обновлен");
          } else {
            console.log(`Invoice ${content.invoice} не найден`);
          }

          channel.ack(msg);
        } catch (error) {
          console.error("Ошибка обработки", error);
          channel.nack(msg, false, true);
        }
      }
    });
    console.log("✅ Worker готов и ждет сообщения...");
  } catch (error) {
    console.error("❌ Ошибка запуска worker:", error);
    process.exit(1);
  }
}

invoiceUpdaterWorker();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Остановка Invoice Updater...");
  await RabbitInit.closeAll();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Остановка Invoice Updater...");
  await RabbitInit.closeAll();
  process.exit(0);
});
