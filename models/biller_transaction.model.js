const { sequelize } = require("../database/config");
const { DataTypes } = require("sequelize");

const Biller_transaction = sequelize.define(
  "biller_transaction",
  {
    biller_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
    },
    sessionId: {
      type: DataTypes.STRING,
    },
    billReferenceNumber: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.STRING,
    },
    notificationMessage: {
      type: DataTypes.STRING,
    },
    transactionId: {
      type: DataTypes.STRING,
    },
    inquiryOriginalResponse: {
      type: DataTypes.STRING,
    },
    inquiryStatus: {
      type: DataTypes.STRING,
    },
    paymentOriginalResponse: {
      type: DataTypes.STRING,
    },
    paymentStatus: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "biller_transaction",
  }
);

// Biller_transaction.sync({ force: true });
// console.log("The table for the User model was just (re)created!");

module.exports = { Biller_transaction };
