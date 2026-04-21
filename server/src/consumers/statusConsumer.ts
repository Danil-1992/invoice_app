// server/src/consumers/statusConsumer.ts
import RabbitInit from "../configs/rabbit.config";
import { notifyInvoice } from "../socket/server";

export async function startStatusConsumer() {
  const channel = await RabbitInit.initChannel("status", "status_consumer");
  const exchange = "invoice_exchange";
  const queue = "status_notifications";
  const routingKey = "status_update";

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routingKey);

  console.log("✅ Status Consumer запущен. Слушаю статусы...");

  channel.consume(queue, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log(
        `📥 Received status: invoice ${data.invoiceId} -> ${data.status}`
      );

      // Отправляем на фронтенд через Socket
      notifyInvoice( data.event, data);

      channel.ack(msg);
    }
  });
}
