const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const T_Traffic_Status_History = sequelize.define(
    "T_Traffic_Status_History",
    {
      T_Traffic_Status_History_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Intersection_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Client_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Camera_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Edge_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Vehicle_L: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Vehicle_M: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Vehicle_S: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      DateTime: {
        type: Sequelize.DATE(6),
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      Note: {
        type: Sequelize.TEXT("medium"),
        allowNull: true,
        collate: "SQL_Latin1_General_CP1_CI_AS",
      },
    },
    {
      tableName: "T_Traffic_Status_History",
      timestamps: false,
    }
  );
  return T_Traffic_Status_History;
};
