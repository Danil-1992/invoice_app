"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Invoices", [
      {
        status: "draft",
        total: 150,
        pdf_url: null,
        user_id: 1,
        client_name: "Acme Corp",
      },
      {
        status: "paid",
        total: 300,
        pdf_url: null,
        user_id: 1,
        client_name: "Google LLC",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Invoices", null, {});
  },
};
