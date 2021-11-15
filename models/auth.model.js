const { sequelize } = require("../database/config");
const { DataTypes } = require("sequelize");

const auth = sequelize.define(
  "auth",
  {
    userKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pwd: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "auth",
  }
);

// auth.sync({ force: true });
// console.log("The table for the User model was just (re)created!");

module.exports = auth;
