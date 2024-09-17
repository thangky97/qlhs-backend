const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  const T_Traffic_Control_Info_History = sequelize.define('T_Traffic_Control_Info_History', {
    ID: {
      type: Sequelize.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true
    },
    Client_ID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    User_ID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Intersection_ID: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    Edge_ID: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    Process_ID: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    Process_Status: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "0: offline, 1: online"
    },
    On_Off_line: {
      type: Sequelize.TINYINT,
      allowNull: true,
      comment: "0: offline, 1: online"
    },
    Q_Traffic_Machine_ID: {
      type: Sequelize.TINYINT,
      allowNull: true,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    },
    Q_Machine_ID: {
      type: Sequelize.TINYINT,
      allowNull: true,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    },
    Opt_signal_ID: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Opt_signal_Time: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    DateTime: {
      type: Sequelize.DATE(6),
      allowNull: true
    },
    Service_Mapping_ID: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
  }, {
    tableName: 'T_Traffic_Control_Info_History',
    timestamps: false
  });

  return T_Traffic_Control_Info_History;
}