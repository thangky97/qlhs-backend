const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const MCamera = sequelize.define(
    "M_Camera",
    {
      Camera_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Camera_Type: {
        type: Sequelize.TEXT("medium"),
        allowNull: true,
      },
      Camera_model: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Intersection_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Client_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      IP_Address: {
        type: Sequelize.TEXT("medium"),
        allowNull: true,
      },
      Control_Type: {
        type: Sequelize.TINYINT,
        allowNull: true,
        comment:
          "1: dieu khien cai san; 2; dieu khien theo vong lap; 3: dieu khien toi uu",
      },
      Time_Streaming_Start: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      Time_Streaming_End: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      SerialNumber: {
        type: Sequelize.TEXT("medium"),
        allowNull: true,
      },
      Status: {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: "0 : offline, 1 : online",
      },
      CreateDateTime: {
        type: Sequelize.DATE(6),
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      Note: {
        type: Sequelize.TEXT("medium"),
        allowNull: true,
      },
      is_deleted: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        comment: "0 : not deleted, 1 : deleted",
      },
    },
    {
      tableName: "M_Camera",
      timestamps: false,
    }
  );

  return MCamera;
};
