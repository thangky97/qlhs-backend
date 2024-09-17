const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  const T_Q_Traffic_Transaction_History = sequelize.define('T_Q_Traffic_Transaction_History', {
    Req_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Amount: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    Service: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    Transaction_Type: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    Time: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    User_ID: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    Note: {
      type: Sequelize.TEXT('medium'),
      allowNull: true
    },
    DateTime: {
      type: Sequelize.DATE(6),
      allowNull: false
    }
  }, {
    tableName: 'T_Q_Traffic_Transaction_History',
    timestamps: false
  });

  return T_Q_Traffic_Transaction_History;
}