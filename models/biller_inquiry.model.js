const { sequelize } = require("../database/config");
const { DataTypes } = require("sequelize");

const Biller_inquiry = sequelize.define(
  "biller_inquiry",
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
    partner_response: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "biller_inquiry",
  }
);

// Biller_inquiry.sync({ force: true });
// console.log("The table for the User model was just (re)created!");

module.exports = { Biller_inquiry };
