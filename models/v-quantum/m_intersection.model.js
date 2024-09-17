const Sequelize = require("sequelize");
module.exports = (sequelize) => {
  const M_Intersection = sequelize.define(
    "M_Intersection",
    {
      Intersection_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Edge_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Intersection_name: {
        type: Sequelize.TEXT("medium"),
        allowNull: false,
        collate: "SQL_Latin1_General_CP1_CI_AS",
      },
      Client_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      CreateDateTime: {
        type: Sequelize.DATE(6),
        allowNull: false,
      },
      Note: {
        type: Sequelize.TEXT("medium"),
        allowNull: true,
        collate: "SQL_Latin1_General_CP1_CI_AS",
      },
      Status: {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue: 0,
        comment: "0 : hide, 1 : show",
      },
      Last_Update_By: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "Last update by",
      },
      is_deleted: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        comment: "1: deleted, 0: not deleted",
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Service_Mapping_ID: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "M_Intersection",
      timestamps: true,
    }
  );
  return M_Intersection;
};
