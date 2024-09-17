const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  const M_Q_Machine = sequelize.define('M_Q_Machine', {
    Q_Machine_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Q_Machine_Name: {
      type: Sequelize.TEXT('medium'),
      allowNull: true
    },
    Q_Machine_IP_Address: {
      type: Sequelize.TEXT('medium'),
      allowNull: false
    },
    Q_Machine_Token: {
      type: Sequelize.TEXT('medium'),
      allowNull: false
    },
    Note: {
      type: Sequelize.TEXT('medium'),
      allowNull: true,
      collate: 'SQL_Latin1_General_CP1_CI_AS'
    }
  }, {
    tableName: 'M_Q_Machine',
    timestamps: false
  });

  return M_Q_Machine;
}