import RabbitInit from "./configs/rabbit.config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { generateInvoicePDF } from "./services/pdfGenerator";

// Инициализация S3 клиента для MinIO
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.AWS_ENDPOINT || "http://minio:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "minioadmin",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "minioadmin",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "invoices";

async function pdfWorker() {
  const channel = await RabbitInit.initChannel("invoice", "pdf_consumer");
  const exchange = "invoice_exchange";
  const queue = "pdf_queue";
  const routingKey = "pdf_generate";

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routingKey);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  console.log(`✅ PDF Worker запущен. Жду задачи...`);

  channel.consume(queue, async (msg) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());

        channel.publish(
          exchange,
          "status_update",
          Buffer.from(
            JSON.stringify({
              status: "processing",
              event: "update_invoice",
              userId: content.userId,
              invoiceId: content.invoice.id,
            })
          )
        );

        await delay(2000);
        const pdfData = {
          invoice: {
            ...content.invoice,
            status: "completed", // ← принудительно completed для PDF
          },
          invoiceItems: content.invoiceItems,
        };
        console.log("📄 Начинаю делать PDF для инвойса:", content.invoice.id);
        console.log("📊 Данные:", {
          client: content.invoice.client_name,
          items: content.invoiceItems.length,
          total: content.invoice.total,
        });
        console.log("📊 Статус для PDF:", pdfData.invoice.status);
        // console.log("📊 Полные данные:", JSON.stringify(pdfData, null, 2));
        // 1. Генерируем PDF
        const pdfBuffer = await generateInvoicePDF(pdfData);

        // 2. Загружаем в MinIO
        const fileName = `invoice_${content.invoice.id}.pdf`;

        // Правильный bucket
        const uploadCommand = new PutObjectCommand({
          Bucket: BUCKET_NAME, // ← только имя bucket
          Key: fileName, // ← только имя файла
          Body: pdfBuffer,
          ContentType: "application/pdf",
        });

        await s3Client.send(uploadCommand);
        console.log(`✅ PDF загружен в MinIO: ${fileName}`);
        // const directUrl = `http://localhost:9000/invoices/${fileName}`;
        // const command = new GetObjectCommand({
        //   Bucket: "invoices",
        //   Key: fileName,
        // });
        // const presignedUrl = await getSignedUrl(s3Client, command, {
        //   expiresIn: 3600,
        // });
        // const publicUrl = presignedUrl.replace('minio:9000', 'localhost:9000');
        // console.log(publicUrl, "ссылка pdf");

        channel.publish(
          exchange,
          "update_invoice",
          Buffer.from(
            JSON.stringify({
              invoiceId: content.invoice.id,
              pdfName: fileName,
              userId: content.userId,
              pdfUrl: fileName,
            })
          ),
          { persistent: true }
        );

        channel.ack(msg);
        console.log("✅ Сообщение подтверждено, PDF готов\n");
      } catch (error) {
        console.error("❌ Ошибка при генерации PDF:", error);
        channel.nack(msg, false, false);
      }
    }
  });
}

// Запускаем worker
pdfWorker().catch((error) => {
  console.error("❌ PDF worker упал:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Остановка PDF worker...");
  await RabbitInit.closeAll();
  process.exit(0);
});

export default pdfWorker;
