"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Invoice_items", [
      {
        name: "Design work",
        quantity: 2,
        price: 50,
        total: 100,
        invoice_id: 1,
      },
      {
        name: "Development",
        quantity: 1,
        price: 50,
        total: 50,
        invoice_id: 1,
      },
      {
        name: "Consulting",
        quantity: 3,
        price: 100,
        total: 300,
        invoice_id: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Invoice_items", null, {});
  },
};
