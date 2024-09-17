const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const ClientSchema = sequelize.define(
    "M_Client",
    {
      Client_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Client_Name: {
        type: Sequelize.TEXT("medium"),
        allowNull: false,
      },
      Token_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Note: {
        type: Sequelize.TEXT("medium"),
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "M_Client",
    }
  );

  return ClientSchema;
};
