import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const sequelize = new Sequelize(
  process.env.POSTGRES_DB!,
  process.env.POSTGRES_USER!,
  process.env.POSTGRES_PASSWORD!,
  {
    host: process.env.POSTGRES_HOST || "postgres",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    dialect: "postgres",
    logging: console.log,
  }
);

import UserJS from "./models/user";
import UserBalanceJS from "./models/user_balance";
import InvoiceJS from "./models/invoice";
import InvoiceItemJS from "./models/invoice_item";
import TransactionJS from "./models/transaction";

const User = UserJS(sequelize, DataTypes);
const UserBalance = UserBalanceJS(sequelize, DataTypes);
const Invoice = InvoiceJS(sequelize, DataTypes);
const InvoiceItem = InvoiceItemJS(sequelize, DataTypes);
const Transaction = TransactionJS(sequelize, DataTypes);

// 👇 ДОБАВИТЬ ЭТИ ДВЕ СТРОКИ
if (Invoice.associate) Invoice.associate({ Invoice_item: InvoiceItem });
if (InvoiceItem.associate) InvoiceItem.associate({ Invoice });

export { User, UserBalance, Invoice, InvoiceItem, Transaction, sequelize };

export default {
  User,
  UserBalance,
  Invoice,
  InvoiceItem,
  Transaction,
  sequelize,
  Sequelize,
};
