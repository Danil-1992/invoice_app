"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invoice_item extends Model {
    static associate({ Invoice }) {
      this.belongsTo(Invoice, { foreignKey: "invoice_id" });
    }
  }
  Invoice_item.init(
    {
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      invoice_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Invoice_item",
    }
  );
  return Invoice_item;
};
