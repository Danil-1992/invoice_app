// server/src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import authRouter from "./routes/auth.router";
import balanceRouter from "./routes/balance.router";
import invoiceRouter from "./routes/invoice.router";
import { createSocketServer } from "./socket/server";
import { startStatusConsumer } from "./consumers/statusConsumer";
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Создаем Socket сервер
createSocketServer(server);

const corsOption = {
  origin: "http://localhost:3002",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

app.use("/api/auth", authRouter);
app.use("/api/balance", balanceRouter);
app.use("/api/invoice", invoiceRouter);

// Запускаем consumer для статусов
startStatusConsumer();

// Экспортируем app и server
export { app, server };