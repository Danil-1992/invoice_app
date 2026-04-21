"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate({ Invoice_item }) {
      this.hasMany(Invoice_item, { foreignKey: "invoice_id" });
    }
  }
  Invoice.init(
    {
      status: DataTypes.STRING,
      total: DataTypes.INTEGER,
      pdf_url: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      client_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Invoice",
    }
  );
  return Invoice;
};
