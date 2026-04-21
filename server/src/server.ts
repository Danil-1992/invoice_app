import dotenv from "dotenv";
import { server } from "./app";
import RabbitInit from "./configs/rabbit.config";

dotenv.config();

const port = parseInt(process.env.PORT || "3000", 10);

// Запускаем HTTP сервер
server.listen(port, (err?: Error) => {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  console.log(`🚀 Сервер запущен на порту ${port}`);
  console.log(`🔌 Socket.IO ready`);
});

// Корректное завершение
process.on("SIGINT", async () => {
  console.log("\n🛑 Получен сигнал завершения...");

  // Закрываем HTTP сервер
  server.close(() => {
    console.log("✅ HTTP сервер закрыт");
  });

  // Закрываем соединения с RabbitMQ
  await RabbitInit.closeAll();

  process.exit(0);
});
