const { sequelize } = require("../database/config");
const { DataTypes } = require("sequelize");

const Biller_routing = sequelize.define(
  "biller_routing",
  {
    biller_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pwd: {
      type: DataTypes.STRING,
    },
    inquiryUrl: {
      type: DataTypes.STRING,
    },
    confirmationUrl: {
      type: DataTypes.STRING,
    },
    checkStatusUrl: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "biller_routing",
  }
);

// Biller_routing.sync({ force: true });
// console.log("The table for the User model was just (re)created!");

module.exports = { Biller_routing };
