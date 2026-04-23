"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Transaction = exports.InvoiceItem = exports.Invoice = exports.UserBalance = exports.User = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const sequelize = new sequelize_1.Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST || "postgres",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    dialect: "postgres",
    logging: console.log,
});
exports.sequelize = sequelize;
const user_1 = __importDefault(require("./models/user"));
const user_balance_1 = __importDefault(require("./models/user_balance"));
const invoice_1 = __importDefault(require("./models/invoice"));
const invoice_item_1 = __importDefault(require("./models/invoice_item"));
const transaction_1 = __importDefault(require("./models/transaction"));
const User = (0, user_1.default)(sequelize, sequelize_1.DataTypes);
exports.User = User;
const UserBalance = (0, user_balance_1.default)(sequelize, sequelize_1.DataTypes);
exports.UserBalance = UserBalance;
const Invoice = (0, invoice_1.default)(sequelize, sequelize_1.DataTypes);
exports.Invoice = Invoice;
const InvoiceItem = (0, invoice_item_1.default)(sequelize, sequelize_1.DataTypes);
exports.InvoiceItem = InvoiceItem;
const Transaction = (0, transaction_1.default)(sequelize, sequelize_1.DataTypes);
exports.Transaction = Transaction;
// 👇 ДОБАВИТЬ ЭТИ ДВЕ СТРОКИ
if (Invoice.associate)
    Invoice.associate({ Invoice_item: InvoiceItem });
if (InvoiceItem.associate)
    InvoiceItem.associate({ Invoice });
exports.default = {
    User,
    UserBalance,
    Invoice,
    InvoiceItem,
    Transaction,
    sequelize,
    Sequelize: sequelize_1.Sequelize,
};
